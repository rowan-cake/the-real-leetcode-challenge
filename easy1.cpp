#include <vector>
#include <iostream>
#include <map>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        map<int,int> map;
        for (int i = 0; i < nums.size(); i++) {
            map[nums[i]] = i;
        }
        for (int i = 0; i < nums.size(); i++) {
            int key = target - nums[i];
            if (map.find(key) != map.end() && map[key] != i) {
                return {i, map[key]};
            }
        }
        return {};
    }
};

int main() {
    Solution solution;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = solution.twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    
    vector<int> nums2 = {3,2,4};
    result = solution.twoSum(nums2, 6);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    
    vector<int> nums3 = {3,3};
    result = solution.twoSum(nums3, 6);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    /*
    [3,2,4]
    6
    [3,3]
    6
    */
    //
    return 0;
}
