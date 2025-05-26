/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeNodes(ListNode* head) {
       ListNode* temp = head;
       temp = head.next;
       // 0 
       ListNode* newHead = new ListNode(temp.val);
       ListNode* tempNew = newHead;
       
       while(temp.next!=nullptr){
         if(temp.next.val==0){
            // make new node 
            ListNode* next = new ListNode(0);
            // make newHead.next point to it
            tempNew.next = next;
            // countine
            tempNew = tempNew.next;
         }else{
            tempNew.val += temp.next.val;
         }
        temp = temp.next;
       } 
       return newHead;
    }
};