<script setup lang="ts">
import { ref } from 'vue';

import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DxButton from 'devextreme-vue/button';
import { DxColumn, DxSelection, DxTreeList } from 'devextreme-vue/tree-list';
import type dxTreeList from 'devextreme/ui/tree_list';
import type { Node } from 'devextreme/ui/tree_list';
import { employees } from '../data';
import type { Employee } from '../data';

type EmployeeNode = Node<Employee, number>;

const expandedRowKeys = [1, 2, 10];
const treeListRef = ref<InstanceType<typeof DxTreeList>>();
const selectedText = ref('');

function getAllSelectedNodes(
  treeListInstance: dxTreeList<Employee, number>,
  parentKeys: number[],
  skipParent?: boolean,
): EmployeeNode[] {
  let result: EmployeeNode[] = [];

  parentKeys.forEach((key) => {
    const insertIndex = result.length;
    const node = treeListInstance.getNodeByKey(key);
    let parentNode: EmployeeNode | undefined = node.parent;
    const childKeys = (node.children ?? []).map((child) => child.key);

    while (parentNode && parentNode.level >= 0 && !skipParent) {
      const currentParent = parentNode;
      const isCollected = result.some((nodeItem) => nodeItem.key === currentParent.key);
      if (!isCollected && treeListInstance.isRowSelected(currentParent.key)) {
        result.splice(insertIndex, 0, currentParent);
        parentNode = currentParent.parent;
      } else {
        break;
      }
    }

    result.push(node);
    result = result.concat(getAllSelectedNodes(treeListInstance, childKeys, true));
  });

  return result;
}

function onButtonClick() {
  const treeList = treeListRef.value?.instance as dxTreeList<Employee, number> | undefined;
  if (!treeList) {
    return;
  }

  const selectedRowKeys = treeList.getSelectedRowKeys();
  const names = getAllSelectedNodes(treeList, selectedRowKeys)
    .map((node) => node.data?.Full_Name)
    .join(', ');

  selectedText.value = `Selected row keys: ${names}`;
}
</script>
<template>
  <div>
    <DxTreeList
      ref="treeListRef"
      :height="500"
      :data-source="employees"
      key-expr="ID"
      parent-id-expr="Head_ID"
      :show-row-lines="true"
      :expanded-row-keys="expandedRowKeys"
    >
      <DxSelection
        mode="multiple"
        :recursive="true"
      />
      <DxColumn data-field="Full_Name"/>
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
        :width="120"
      />
    </DxTreeList>
    <DxButton
      text="Get all selected keys"
      @click="onButtonClick"
    />
    <div id="selected-keys">{{ selectedText }}</div>
  </div>
</template>
<style>
#selected-keys {
  padding: 40px;
  margin-top: 20px;
  background-color: rgb(191 191 191 / 15%);
}
</style>
