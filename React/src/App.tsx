import { useCallback, useRef, useState } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import Button from 'devextreme-react/button';
import TreeList, { Column, Selection } from 'devextreme-react/tree-list';
import type { TreeListRef, TreeListTypes } from 'devextreme-react/tree-list';
import dxTreeList from 'devextreme/ui/tree_list';
import { employees } from './data';
import type { Employee } from './data';

type EmployeeNode = TreeListTypes.Node<Employee, number>;

const expandedRowKeys = [1, 2, 10];

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

function App(): JSX.Element {
  const treeListRef = useRef<TreeListRef<Employee, number>>(null);
  const [selectedText, setSelectedText] = useState('');

  const onButtonClick = useCallback(() => {
    const treeList = treeListRef.current?.instance();
    if (!treeList) {
      return;
    }

    const selectedRowKeys = treeList.getSelectedRowKeys();
    const names = getAllSelectedNodes(treeList, selectedRowKeys)
      .map((node) => node.data?.Full_Name)
      .join(', ');

    setSelectedText(`Selected row keys: ${names}`);
  }, []);

  return (
    <div className="main">
      <TreeList
        ref={treeListRef}
        height={500}
        dataSource={employees}
        keyExpr="ID"
        parentIdExpr="Head_ID"
        showRowLines={true}
        defaultExpandedRowKeys={expandedRowKeys}
      >
        <Selection mode="multiple" recursive={true} />
        <Column dataField="Full_Name" />
        <Column dataField="Title" caption="Position" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column dataField="Hire_Date" dataType="date" width={120} />
      </TreeList>
      <Button text="Get all selected keys" onClick={onButtonClick} />
      <div id="selected-keys">{selectedText}</div>
    </div>
  );
}

export default App;
