// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library ku {
    function toString(uint _num) internal pure returns (string memory) {
        if (_num == 0) {
            return "0";
        }
        uint num = _num;
        uint length;
        while (num != 0) {
            length++;
            num /= 10;
        }
        bytes memory str = new bytes(length);
        uint i = length - 1;
        while (_num != 0) {
            str[i] = bytes1(uint8(48 + (_num % 10)));
            unchecked {
                i--;
            }
            _num /= 10;
        }
        return string(str);
    }

    function addressToString(
        address _address
    ) public pure returns (string memory) {
        bytes20 value = bytes20(uint160(_address));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3 + i * 2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
}
