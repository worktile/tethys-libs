import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';

export const entries: ThyBoardEntry[] = [
    {
        _id: '1',
        name: '未开始'
    },
    {
        _id: '2',
        name: '进行中'
    },
    {
        _id: '3',
        name: '已完成'
    },
    {
        _id: '4',
        name: '已关闭'
    }
];

export const items: ThyBoardCard[] = [
    {
        _id: '1',
        title: '项目1-1',
        laneId: '1',
        entryId: '1'
    },
    {
        _id: '2',
        title: '项目2',
        laneId: '1',
        entryId: '1'
    },
    {
        _id: '3',
        title: '项目3',
        laneId: '2',
        entryId: '2'
    },
    {
        _id: '4',
        title: '项目4',
        laneId: '1',
        entryId: '1'
    },
    {
        _id: '5',
        title: '项目5',
        laneId: '1',
        entryId: '1'
    },
    {
        _id: '6',
        title: '项目6',
        laneId: '1',
        entryId: '1'
    }
];

export const lanes: ThyBoardLane[] = [
    {
        _id: '1',
        name: '泳道1'
    },
    {
        _id: '2',
        name: '泳道2'
    },
    {
        _id: '3',
        name: '泳道3'
    }
];
