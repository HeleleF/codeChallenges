
class MyNode {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.first = null;
        this.last = null;
    }
    addFront(d) {
        const node = new MyNode(d);
        node.prev = null;
        node.next = this.first;

        if (this.first === null) {
            this.last = node;
        } else {
            this.first.prev = node;
        }

        this.first = node;
    }
    addBack(d) {

        const node = new MyNode(d);
        node.prev = this.last;
        node.next = null;

        if (this.last === null) {
            this.first = node;
        } else {
            this.last.next = node;
        }
            	
        this.last = node; 
    }
    forwards() {
        let trav = this.first;
        const r = [];
        
        while (trav !== null) {
            r.push(trav.data);
            trav = trav.next;
        }
        return r.join('');
    }
    backwards() {
        let trav = this.last;
        
        while (trav !== null) {
            console.log(`Visiting node ${trav.data}`);
            trav = trav.prev;
        }
    }
    find(d) {
        let trav = this.first;
        
        while (trav && trav.data !== d) {
            trav = trav.next;
        }
        return trav;  
    }

    insertAfter(n, d) {

        const tmp = new MyNode(d);

        tmp.prev = n;
        tmp.next = n.next;
        n.next = tmp;

        if(n.next === null) this.last = temp;
    }

    insertBefore(n, d) {

        const tmp = new MyNode(d);
        
        tmp.next = n;
        tmp.prev = n.prev;
        n.prev = tmp;
        
        if (tmp.prev === null) this.first = tmp;
        
    }
}

/**
 * 
 * @param {string[][]} triplets 
 */
const recoverSecret = triplets => {

    const list = new DoublyLinkedList();
    let [f, s, l] = triplets[0];

    list.addBack(f);
    list.addBack(s);
    list.addBack(l);

    const seen = [];

    for (let i = 1; i < triplets.length; i++) {
        ([f, s, l] = triplets[i]);

        const fn = list.find(f);
        const sn = list.find(s);
        const ln = list.find(l);

        if (fn && !sn) {
            list.insertAfter(fn, s);
        }
        if (!fn && sn) {
            list.insertBefore(sn, f);
        }
        list.forwards();
    }
}
