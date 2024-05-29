// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "hardhat/console.sol";
import "./ku.sol";

contract BreedingBarn {
    address public admin;
    address public Market;
    using ku for uint256;
    using ku for address;
    //恐龙对象
    struct Dinosaur {
        uint256 id;
        bool isMale;
        bool isPaired;
        string species;
        string color;
        uint256 rarity;
        address owner;
        string pictrueUri; //图片uri
    }

    //龙蛋对象
    struct Egg {
        uint256 id;
        uint256 parentId1;
        uint256 parentId2;
        string species;
        address owner;
        bool isHatched;
    }

    Dinosaur[] public dinosaurs;
    Egg[] public eggs;

    function dinLength() public view returns (uint256) {
        return dinosaurs.length;
    }

    function eggLength() public view returns (uint256) {
        return dinosaurs.length;
    }

    //孵化开始的时间戳
    mapping(uint256 => uint256) public hatchTimer;
    //记录价格
    mapping(uint256 => uint256) public dinPrice;
    mapping(uint256 => uint256) public eggPrice;
    //记录上传者
    mapping(uint256 => address) public dinSeller;
    mapping(uint256 => address) public eggSeller;

    mapping(address => uint256) public hatchBarn;
    mapping(uint256 => uint256) public femalePregnancy;

    constructor(address _Market) {
        admin = msg.sender;
        Market = _Market;
    }

    function getDinosaurValue(
        uint256 id,
        uint choose
    ) public view returns (string memory) {
        Dinosaur storage d = dinosaurs[id];
        if (choose == 0) return d.id.toString();
        if (choose == 1) {
            bool m = d.isMale;
            if (m == true) return "male";
            else return "female";
        }
        if (choose == 2) {
            bool m = d.isPaired;
            if (m == true) return "pregnant";
            else return "no";
        }
        if (choose == 3) return d.species;
        if (choose == 4) return d.color;
        if (choose == 5) return d.rarity.toString();
        // if (choose==6)  return d.owner.addressToString();
        if (choose == 7) return d.pictrueUri;
    }

    function getEggValue(
        uint256 id,
        uint choose
    ) public view returns (string memory) {
        Egg storage d = eggs[id];
        if (choose == 0) return d.id.toString();
        if (choose == 1) return d.parentId1.toString();
        if (choose == 2) return d.parentId2.toString();
        if (choose == 3) return d.species;
        if (choose == 5) {
            bool m = d.isHatched;
            if (m == true) return "hatching";
            else return "no";
        }
    }

    function getOwner(bool isDin, uint256 id) public view returns (address) {
        if (isDin == true) {
            return dinosaurs[id].owner;
        } else {
            return eggs[id].owner;
        }
    }

    //只有管理员可以手动增加恐龙
    function addDinosaur(
        bool _isMale,
        string memory _species,
        string memory _color,
        uint256 _rarity,
        address _owner
    ) public {
        //get image uri
        string memory uri = getImage(false, _species, _color, _rarity);
        //add dinosaurs
        dinosaurs.push(
            Dinosaur(
                dinosaurs.length,
                _isMale,
                false,
                _species,
                _color,
                _rarity,
                _owner,
                uri
            )
        );
    }

    //恐龙交配需要持有者拥有相同种类的雌雄两只恐龙
    function pairDinosaurs(
        uint256 dinosaurId1,
        uint256 dinosaurId2
    ) public returns (uint256) {
        require(
            dinosaurId1 < dinosaurs.length && dinosaurId2 < dinosaurs.length,
            "Dinosaur ID out of range."
        );
        require(
            dinosaurs[dinosaurId1].isMale != dinosaurs[dinosaurId2].isMale,
            "Dinosaurs must be of opposite genders."
        );
        if (dinosaurs[dinosaurId1].isMale == false) {
            require(
                femalePregnancy[dinosaurId1] + 100 < block.timestamp,
                "The female is still pregnant"
            );
        } else {
            require(
                femalePregnancy[dinosaurId2] + 100 < block.timestamp,
                "The female is still pregnant"
            );
        }
        require(
            dinosaurs[dinosaurId1].owner == dinosaurs[dinosaurId2].owner &&
                dinosaurs[dinosaurId1].owner == msg.sender,
            "you don`t have these two dinosaurs"
        );
        string memory s1 = dinosaurs[dinosaurId1].species;
        string memory s2 = dinosaurs[dinosaurId2].species;
        require(
            keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2)),
            "Two dinosaurs must be one specie."
        );

        if (dinosaurs[dinosaurId1].isMale == false) {
            dinosaurs[dinosaurId1].isPaired = true;
            femalePregnancy[dinosaurId1] = block.timestamp;
        } else {
            dinosaurs[dinosaurId2].isPaired = true;
            femalePregnancy[dinosaurId2] = block.timestamp;
        }

        eggs.push(
            Egg(eggs.length, dinosaurId1, dinosaurId2, s1, msg.sender, false)
        );
        return eggs.length - 1;
    }

    //恐龙孵化
    function hatchEgg(uint256 eggId) public {
        require(eggId < eggs.length, "Egg ID out of range.");
        require(eggs[eggId].isHatched == false, "The egg has already hatched.");
        require(eggs[eggId].owner == msg.sender, "you don`t have this egg");
        hatchBarn[msg.sender] += 1;
        require(hatchBarn[msg.sender] <= 6, "you only have six breedingbarn");
        eggs[eggId].isHatched = true;
        hatchTimer[eggId] = block.timestamp;
    }

    //取走恐龙
    function getOffEgg(uint256 eggId) public {
        require(msg.sender == eggs[eggId].owner);
        uint256 hatchTime = 100;
        require(hatchTimer[eggId] + hatchTime < block.timestamp, "hatching...");
        console.log(unicode"time permits");
        bool _isMale = false;
        if (block.timestamp % 2 == 1) _isMale = true;
        string memory _color = "red";
        if (block.number % 2 == 1) {
            _color = "blue";
        }
        //get the rarity
        uint256 first = block.timestamp % 6;
        if (first == 1 || first == 0) first += 2;
        uint256 _rarity = first / 2;
        //get uri
        string memory uri = getImage(
            false,
            eggs[eggId].species,
            _color,
            _rarity
        );
        dinosaurs.push(
            Dinosaur(
                dinosaurs.length,
                _isMale,
                false,
                eggs[eggId].species,
                _color,
                _rarity,
                eggs[eggId].owner,
                uri
            )
        );
        console.log("dinosaur birth the id", dinosaurs.length);
        console.log("color is ", _color);
        console.log("rarity is ", _rarity);

        if (eggId != eggs.length - 1) {
            for (uint256 i = eggId; i < eggs.length - 1; i++) {
                eggs[i] = eggs[i + 1];
                console.log(unicode"eggs array move:", i);
            }
            delete eggs[eggs.length - 1];
        } else {
            delete eggs[eggId];
        }
    }

    function getWhoseDinosaur(
        address _owner,
        uint which
    ) public view returns (uint256, uint256) {
        uint length = 0;
        for (uint256 i = 0; i < dinosaurs.length; i++) {
            if (dinosaurs[i].owner == _owner) length++;
        }

        require(length != 0, "you do not have a dinosaur");

        uint256[] memory whose = new uint256[](length);
        uint count = 0;
        for (uint256 i = 0; i < dinosaurs.length; i++) {
            if (dinosaurs[i].owner == _owner) {
                whose[count] = dinosaurs[i].id;
                count++;
            }
        }
        return (whose[which], length);
    }

    function getWhoseEgg(
        address _owner,
        uint which
    ) public view returns (uint256, uint256) {
        uint length = 0;
        for (uint256 i = 0; i < eggs.length; i++) {
            if (eggs[i].owner == _owner) length++;
        }

        require(length != 0, "you do not have a egg");

        uint256[] memory whose = new uint256[](length);
        uint count = 0;
        for (uint256 i = 0; i < eggs.length; i++) {
            if (eggs[i].owner == _owner) {
                whose[count] = eggs[i].id;
                count++;
            }
        }
        return (whose[which], length);
    }

    //上传商品
    function upload(
        bool isdin,
        uint256 id,
        uint256 price
    ) public returns (bool) {
        if (isdin == true) {
            require(
                dinosaurs[id].owner == msg.sender,
                "please upload your own dinosaur"
            );
            dinosaurs[id].owner = Market;
            dinPrice[id] = price;
            dinSeller[id] = msg.sender;
            return true;
        } else {
            require(eggs[id].owner == msg.sender, "please upload your own egg");
            eggs[id].owner = Market;
            eggPrice[id] = price;
            eggSeller[id] = msg.sender;
            return true;
        }
    }

    function buy(bool isDin, uint256 id) public payable returns (bool) {
        console.log(unicode"成功进入buy方法,isDin是:", isDin);
        console.log(unicode"id是:", id);
        if (isDin == true) {
            require(msg.value >= dinPrice[id], "money not enough");
            console.log(unicode"转账之前：", dinSeller[id]);
            console.log(unicode"转账之前：", dinPrice[id]);
            payable(dinSeller[id]).transfer(dinPrice[id]);
            delete dinSeller[id];
            dinosaurs[id].owner = msg.sender;
            payable(msg.sender).transfer(msg.value - dinPrice[id]);
            delete dinPrice[id];
            return true;
        } else {
            require(msg.value >= eggPrice[id], "money not enough");
            payable(eggSeller[id]).transfer(eggPrice[id]);
            delete eggSeller[id];
            eggs[id].owner = msg.sender;
            payable(msg.sender).transfer(msg.value - eggPrice[id]);
            delete eggPrice[id];
            return true;
        }
    }

    function getImage(
        bool isEgg,
        string memory _species,
        string memory color,
        uint256 rarity
    ) private pure returns (string memory) {
        if (isEgg == true) {
            return "https://img2.imgtp.com/2024/05/08/6eSmZK5L.jpg";
        }

        bytes32 b = keccak256(abi.encodePacked("blue"));
        bytes32 r = keccak256(abi.encodePacked("red"));
        bytes32 pt = keccak256(abi.encodePacked("pterosaur"));
        bytes32 ta = keccak256(abi.encodePacked("tanystropheus"));
        bytes32 ty = keccak256(abi.encodePacked("Tyrannosaurus"));

        if (
            keccak256(abi.encodePacked(color)) == b &&
            keccak256(abi.encodePacked(_species)) == pt
        ) {
            //翼龙 蓝色

            if (rarity == 1) {
                return "https://img2.imgtp.com/2024/05/08/BFtBrsDB.jpg";
            } else if (rarity == 2) {
                return "https://img2.imgtp.com/2024/05/08/BhptfjPT.jpg";
            } else {
                return "https://img2.imgtp.com/2024/05/08/KKUjyFzm.jpg";
            }
        } else if (
            keccak256(abi.encodePacked(color)) == r &&
            keccak256(abi.encodePacked(_species)) == pt
        ) {
            //翼龙 红

            if (rarity == 1) {
                return "https://img2.imgtp.com/2024/05/08/v7dSf4Rl.jpg";
            } else if (rarity == 2) {
                return "https://img2.imgtp.com/2024/05/08/jjMQEQv2.jpg";
            } else {
                return "https://img2.imgtp.com/2024/05/08/u4Zln29E.jpg";
            }
        } else if (
            keccak256(abi.encodePacked(color)) == b &&
            keccak256(abi.encodePacked(_species)) == ty
        ) {
            //三角龙 蓝

            if (rarity == 1) {
                return "https://img2.imgtp.com/2024/05/08/8C83Djcj.jpg";
            } else if (rarity == 2) {
                return "https://img2.imgtp.com/2024/05/08/In8yxB8y.jpg";
            } else {
                return "https://img2.imgtp.com/2024/05/08/DDitdlOP.jpg";
            }
        } else if (
            keccak256(abi.encodePacked(color)) == r &&
            keccak256(abi.encodePacked(_species)) == ty
        ) {
            //三角龙 红

            if (rarity == 1) {
                return "https://img2.imgtp.com/2024/05/08/Mutw3P3E.jpg";
            } else if (rarity == 2) {
                return "https://img2.imgtp.com/2024/05/08/gooEKdYC.jpg";
            } else {
                return "https://img2.imgtp.com/2024/05/08/jgO0h6GF.jpg";
            }
        } else if (
            keccak256(abi.encodePacked(color)) == r &&
            keccak256(abi.encodePacked(_species)) == ta
        ) {
            //暴龙 蓝

            if (rarity == 1) {
                return "https://img2.imgtp.com/2024/05/08/8C83Djcj.jpg";
            } else if (rarity == 2) {
                return "https://img2.imgtp.com/2024/05/08/apQ2pkzt.jpg";
            } else {
                return "https://img2.imgtp.com/2024/05/08/diA6aPFM.jpg";
            }
        } else if (
            keccak256(abi.encodePacked(color)) == r &&
            keccak256(abi.encodePacked(_species)) == ta
        ) {
            //暴龙 红 x

            if (rarity == 1) {
                return "https://img2.imgtp.com/2024/05/08/B48JdEOt.jpg";
            } else if (rarity == 2) {
                return "https://img2.imgtp.com/2024/05/08/6ZmZQi4W.jpg";
            } else {
                return "https://img2.imgtp.com/2024/05/08/JlVjb6Qf.jpg";
            }
        } else {
            return "";
        }
    }
}
