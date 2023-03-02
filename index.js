function mergeSort(array){
    if (array.length === 1) return array
    const mid = Math.ceil(array.length/2)
    let half1 = mergeSort(array.splice(0,mid))
    let half2 = mergeSort(array)
    let ans = []
    while(half1.length > 0 || half2.length > 0){
        if(half1.length === 0){
            ans.push(half2.shift())
            continue
        } else if(half2.length === 0){
            ans.push(half1.shift())
            continue
        }
        if (half1[0] === half2[0]){
            half1.shift()
        } else if (half1[0] < half2[0]){
            ans.push(half1.shift())
        } else {( ans.push(half2.shift()))}
    }
    return ans
}
class Node {
    constructor(data){
        this.data = data
        this.left = null
        this.right = null
    }
}

function buildTree(array, start = 0, end = array.length-1){
    if (start > end) return null
    const mid = parseInt((start + end) / 2);
    const node = new Node(array[mid]);
    
    node.left = buildTree(array, start, mid - 1);
 
    node.right = buildTree(array, mid + 1, end);
    return node;
}




class Tree {
    constructor(array) {
        this.root = buildTree(mergeSort(array))
    }

    insert(num, currentNode = this.root){
        if (num === currentNode.data) return
        if(num > currentNode.data){
            if (currentNode.right == null){
                currentNode.right = new Node(num)
                return
            }
            return this.insert(num, currentNode.right)
        }
        if(num < currentNode.data){
            if (currentNode.left == null){
                currentNode.left = new Node(num)
                return
            }
            return this.insert(num, currentNode.left)
        }
    } 

    remove(target, currentNode = this.root, parentNode = null){
        if (currentNode === null) return
        if (target == currentNode.data) {
            let childrenLeft = []
            let childrenRight = []
            if(currentNode.left) childrenLeft = this.inorder(null, currentNode.left)
            if(currentNode.right) childrenRight = this.inorder(null, currentNode.right)
            const children = childrenLeft.concat(childrenRight)
            if (parentNode === null) {
                this.root = buildTree(children) 
                return
            }
            if (currentNode.data < parentNode.data) parentNode.left = buildTree(children)
            else parentNode.right = buildTree(children)
            return
        }
        if (!currentNode.left && !currentNode.right) return
        target < currentNode.data ? this.remove(target, currentNode.left, currentNode) : this.remove(target, currentNode.right, currentNode)
    }

    find(target, node = this.root){
        if (node == null) return '404'
        if (node.data === target) return node
        return target < node.data ? this.find(target, node.left) : this.find(target, node.right)
    }

    levelOrder(callback, array = [], queue = [this.root]){
        if (queue.length === 0) return array
        if (queue[0].left) queue.push(queue[0].left)
        if (queue[0].right) queue.push(queue[0].right)
        if(callback) callback(queue[0])
        else array.push(queue[0].data)
        queue.shift()
        return this.levelOrder(callback, array, queue)
    }

    inorder(callback, node = this.root, array = []){
        if (node === null) return
        this.inorder(callback, node.left, array)
        if (callback) callback(node)
        else array.push(node.data)
        this.inorder(callback, node.right, array)
        return array
    }

    preorder(callback, node = this.root, array = [] ){
        if (node === null) return
        if (callback) callback(node)
        else array.push(node.data)
        this.preorder(callback, node.left, array)
        this.preorder(callback, node.right, array)
        return array
    }

    postorder(callback, node = this.root, array = []){
        if (node === null) return
        this.postorder(callback, node.right, array)
        if (callback) callback(node)
        else array.push(node.data)
        this.postorder(callback, node.left, array)
        return array
    }

    height(node = this.root){
        if (node == null) return 0
        const lHeight = this.height(node.left)
        const rHeight = this.height(node.right)
        return Math.max(lHeight, rHeight) +1
    }

    depth(target, node = this.root){
        if (node == null) return '404'
        if (node.data === target) return 0
        return target < node.data ? this.depth(target, node.left) +1 : this.depth(target, node.right) +1
    }

    isBalanced(nodeQueue = [this.root]){
        if (nodeQueue.length === 0) return true
        if (nodeQueue[0].left) nodeQueue.push(nodeQueue[0].left)
        if (nodeQueue[0].right) nodeQueue.push(nodeQueue[0].right)
        const lHeight = this.height(nodeQueue[0].left)
        const rHeight = this.height(nodeQueue[0].right)
        const dif = lHeight - rHeight
        if (dif > 1 || dif < -1) return false
        nodeQueue.shift()
        return this.isBalanced(nodeQueue)
    }

    rebalance(){
        this.root = buildTree(this.inorder())
    }
}
const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomArray(ints, max) {
    let arr = []
    for(let i = 0; i < ints; i++){
        arr.push(randomInt(max))
    }
    return arr;
  }
// Demonstration 

console.log(`Array of 10 random numbers between 1-100, removing duplicates`)
const myTree = new Tree(getRandomArray(10, 100))

console.log(prettyPrint(myTree.root))

console.log(`The tree is balanced: ${myTree.isBalanced()}`)

console.log(`Level Order: ${myTree.levelOrder()}`)
console.log(`Inorder: ${myTree.inorder()}`)
console.log(`Preorder: ${myTree.preorder()}`)
console.log(`Postorder: ${myTree.postorder()}`)

console.log(`UNBALANCING`)

myTree.insert(randomInt(50)+100)
myTree.insert(randomInt(50)+100)
myTree.insert(randomInt(50)+100)
myTree.insert(randomInt(50)+100)
myTree.insert(randomInt(50)+100)

console.log(prettyPrint(myTree.root))

console.log(`The tree is balanced: ${myTree.isBalanced()}`)

console.log(`REBALANCING`)

myTree.rebalance()

console.log(prettyPrint(myTree.root))

console.log(`The tree is balanced: ${myTree.isBalanced()}`)

console.log(`Level Order: ${myTree.levelOrder()}`)
console.log(`Inorder: ${myTree.inorder()}`)
console.log(`Preorder: ${myTree.preorder()}`)
console.log(`Postorder: ${myTree.postorder()}`)