import * as React from 'react';
import * as _ from 'lodash';
import { Text, pluralize } from '@patternfly/react-core';
import * as classNames from 'classnames';
import { sortable, IRow } from '@patternfly/react-table';
import { Table } from '@console/internal/components/factory';
import {
  ResourceLink,
  humanizeBinaryBytes,
  humanizeCpuCores,
  convertToBaseValue,
} from '@console/internal/components/utils';
import { NodeKind } from '@console/internal/module/k8s';
import { getName, getNodeCPUCapacity, getNodeAllocatableMemory } from '@console/shared';
import { useSelectList } from '@console/shared/src/hooks/select-list';
import { GetRows } from './types';
import './node-selection-list.scss';

const tableColumnClasses = [
  classNames('pf-u-w-30-on-sm'),
  classNames('pf-m-hidden', 'pf-m-visible-on-sm', 'pf-u-w-10-on-sm'),
  classNames('pf-m-hidden', 'pf-m-visible-on-sm', 'pf-u-w-20-on-sm'),
  classNames('pf-m-hidden', 'pf-m-visible-on-sm', 'pf-u-w-20-on-sm'),
  classNames('pf-m-hidden', 'pf-m-visible-on-sm', 'pf-u-w-20-on-sm'),
];

const getColumns = () => {
  return [
    {
      title: 'Name',
      sortField: 'metadata.name',
      transforms: [sortable],
      props: { className: tableColumnClasses[0] },
    },
    {
      title: 'CPU',
      props: { className: tableColumnClasses[1] },
    },
    {
      title: 'Memory',
      props: { className: tableColumnClasses[2] },
    },
    {
      title: 'Location',
      props: { className: tableColumnClasses[3] },
    },
    {
      title: 'Taints',
      props: { className: tableColumnClasses[3] },
    },
  ];
};

const isSelected = (selected: Set<string>, nodeUID: string): boolean => selected.has(nodeUID);

const getRows: GetRows = ({ componentProps }, visibleRows, setVisibleRows, selectedNodes) => {
  const { data: filteredData } = componentProps;

  const rows = filteredData.map((node: NodeKind) => {
    const cpuSpec: string = getNodeCPUCapacity(node);
    const memSpec: string = getNodeAllocatableMemory(node);
    const nodeTaints = node.spec?.taints?.length ?? 0;
    const cells: IRow['cells'] = [
      {
        title: <ResourceLink kind="Node" name={getName(node)} title={node.metadata.uid} />,
      },
      {
        title: `${humanizeCpuCores(cpuSpec).string || '-'}`,
      },
      {
        title: humanizeBinaryBytes(convertToBaseValue(memSpec)).string ?? '-',
      },
      {
        title: node.metadata.labels?.['failure-domain.beta.kubernetes.io/zone'] ?? '-',
      },
      {
        title: pluralize(nodeTaints, 'taint'),
      },
    ];
    return {
      cells,
      selected: selectedNodes ? isSelected(selectedNodes, node.metadata.uid) : false,
      props: {
        id: node.metadata.uid,
      },
    };
  });

  const uids = new Set(filteredData.map((n) => n.metadata.uid));

  if (!_.isEqual(uids, visibleRows)) {
    setVisibleRows(uids);
  }
  return rows;
};

export const NodesSelectionList: React.FC<NodesSelectionListProps> = (props) => {
  const [visibleRows, setVisibleRows] = React.useState<Set<string>>();

  const { onSelect, selectedRows: selectedNodes } = useSelectList<NodeKind>(
    props.data,
    visibleRows,
    props.customData.onRowSelected,
  );

  return (
    <>
      <div className="lso-node-selection-table__table--scroll">
        <Table
          {...props}
          aria-label="Select nodes for creating volume filter"
          data-test-id="create-lvs-form-node-selection-table"
          Header={getColumns}
          Rows={(rowProps) => getRows(rowProps, visibleRows, setVisibleRows, selectedNodes)}
          customData={props.customData}
          virtualize={false}
          onSelect={onSelect}
        />
      </div>
      <Text data-test-id="create-lvs-form-selected-nodes" component="h6">
        {pluralize(selectedNodes?.size, 'node')} selected
      </Text>
    </>
  );
};

type NodesSelectionListProps = {
  data: NodeKind[];
  customData: {
    onRowSelected: (nodes: NodeKind[]) => void;
  };
};
