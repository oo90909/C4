package com.example.nftmarket.structs;

import com.example.nftmarket.entity.DinosaurEgg;
import com.example.nftmarket.entity.Person;

public class NormalDinosaurTree {
    Person personInfo;
    AbstractNode root;

    public NormalDinosaurTree(Person personInfo) {
        this.personInfo = personInfo;
    }

    private AbstractNode addNode(AbstractNode currentNode, SimpleNodeChain chain){
        if(currentNode==null){
            return new AbstractNode(chain);
        }
        Node<DinosaurEgg> sourceFatherNode = currentNode.simpleNodeChain.root.fatherNode.sourceNode;
        Node<DinosaurEgg> sourceMotherNode = currentNode.simpleNodeChain.root.motherNode.sourceNode;
        if (sourceFatherNode!=null){
            if (sourceFatherNode.nodeInfo==chain.root.nodeInfo){
                currentNode.leftNode=addNode(currentNode.leftNode,chain);
            }
        }
        if (sourceMotherNode!=null){
            if (sourceMotherNode.nodeInfo==chain.root.nodeInfo){
                currentNode.rightNode=addNode(currentNode.rightNode, chain);
            }
        }
        return currentNode;
    }
    public void addNode(SimpleNodeChain chain){
        root=addNode(root, chain);
    }
    public void traverserPreOrder(AbstractNode root){
        if (root!=null){
            System.out.println(root.simpleNodeChain);
            traverserPreOrder(root.leftNode);
            traverserPreOrder(root.rightNode);
        }
    }

    public AbstractNode getRoot(){
        return root;
    }
}
