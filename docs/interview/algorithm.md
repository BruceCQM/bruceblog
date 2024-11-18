# 算法相关

[Hello算法](https://www.hello-algo.com/)

## 冒泡排序

冒泡排序（bubble sort）通过连续地比较与交换相邻元素实现排序。

从数组最左端开始向右遍历，依次比较相邻元素大小，如果 “左元素 > 右元素” 就交换二者。遍历完成后，最大的元素会被移动到数组的最右端。

算法流程：

1. 首先，对 𝑛 个元素执行“冒泡”，将数组的最大元素交换至正确位置。
2. 接下来，对剩余 𝑛 − 1 个元素执行“冒泡”，将第二大元素交换至正确位置。
3. 以此类推，经过 𝑛 − 1 轮“冒泡”后，前 𝑛 − 1 大的元素都被交换至正确位置。
4. 仅剩的一个元素必定是最小元素，无须排序，因此数组排序完成。

![Bubble Sort](./images/algorithm/bubble_sort.png)

算法优化：

如果某轮“冒泡”中没有执行任何交换操作，说明数组已经完成排序，可直接返回结果。因此，可以增加一个标志位 flag 来监测这种情况，一旦出现就立即返回。

```js
function bubble(nums) {
  const len = nums.length;
  for (let i = len - 1;i > 0;i--) {
    let flag = false;
    for (let j = 0;j < i;j++) {
      if (nums[j] > nums[j+1]) {
        const temp = nums[j];
        nums[j] = nums[j+1];
        nums[j+1] = temp;
        flag = true;
      }
    }
    // 本轮冒泡没有交换元素，直接跳出循环
    if (!flag) break;
  }
}
```

冒泡排序的最差时间复杂度和平均时间复杂度仍为 𝑂(𝑛²) ；但当输入数组完全有序时，可达到最佳时间复杂度 𝑂(𝑛) 。

## 快速排序

快速排序（quick sort）是一种基于分治策略的排序算法。

快速排序的核心操作是“哨兵划分”，其目标是：选择数组中的某个元素作为“基准数”，将所有小于基准数的元素移到其左侧，而大于基准数的元素移到其右侧。

1. 选取数组最左端元素作为基准数，初始化两个指针 i 和 j 分别指向数组的两端。
2. 设置一个循环，在每轮中使用 i（j）分别寻找第一个比基准数大（小）的元素，然后交换这两个元素。
3. 循环执行步骤 2. ，直到 i 和 j 相遇时停止，最后将基准数交换至两个子数组的分界线。

哨兵划分完成后，原数组被划分成三部分：左子数组、基准数、右子数组，且满足“左子数组任意元素 ≤ 基准数 ≤ 右子数组任意元素”。接着继续对子数组进行排序即可。

算法流程：

1. 首先，对原数组执行一次“哨兵划分”，得到未排序的左子数组和右子数组。
2. 然后，对左子数组和右子数组分别递归执行“哨兵划分”。
3. 持续递归，直至子数组长度为 1 时终止，从而完成整个数组的排序。

```js
function swap(nums, left, right) {
  const temp = nums[left];
  nums[left] = nums[right];
  nums[right] = temp;
}

// 哨兵划分
function partition(nums, left, right) {
  // 以 nums[left] 为基准数
  let i = left;
  let j = right;
  while(i < j) {
    // 从右向左找首个小于基准数的元素
    while (i < j && nums[j] >= nums[left]) {
      j -= 1;
    }
    while (i < j && nums[i] <= nums[left]) {
       // 从左向右找首个大于基准数的元素
      i += 1;
    }
    swap(nums, i, j);
  }
  // 将基准数交换至两子数组的分界线
  swap(nums, i, left);
  return i;
}

function quickSort(nums, left, right) {
  // 子数组长度为 1 时终止递归
  if (left >= right) {
    return;
  }
  // 哨兵划分
  const pviot = partition(nums, left, right);
  // 递归左右子数组
  quickSort(nums, left, pviot - 1);
  quickSort(nums, pviot + 1, right);
}

const arr = [12,4,6,2,1,88];
quickSort(arr, 0, 3);
console.log(arr); // [ 2, 4, 6, 12, 1, 88 ]
```