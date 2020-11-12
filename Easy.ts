/* Given a sorted array nums, remove the duplicates in-place such that each element appears only once and returns the new length.

Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.

Clarification:

Confused why the returned value is an integer but your answer is an array?

Note that the input array is passed in by reference, which means a modification to the input array will be known to the caller as well. */

function removeDuplicates(nums: number[]): number {
    for (let index = 0; index < nums.length; index++) {
        if (index === 0) continue;

        const current = nums[index];
        const prev = nums[index - 1];
        if (current === prev) {
            nums.splice(index, 1);
            index--;
        }
    }
    return nums.length;
};