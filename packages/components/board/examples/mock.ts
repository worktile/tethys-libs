import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';

export const entries: ThyBoardEntry[] = [
    {
        _id: '1',
        name: '未开始',
        wipLimit: 6,
        droppableZones: [
            {
                _id: '1',
                name: '未开始'
            },
            {
                _id: '2',
                name: '未排期'
            }
        ]
    },
    {
        _id: '2',
        name: '进行中',
        wipLimit: 1,
        droppableZones: [
            {
                _id: '3',
                name: '进行中'
            },
            {
                _id: '4',
                name: '处理中'
            }
        ]
    },
    {
        _id: '3',
        name: '已完成',
        droppableZones: [
            {
                _id: '5',
                name: '已完成'
            },
            {
                _id: '6',
                name: '已解决'
            }
        ]
    },
    {
        _id: '4',
        name: '已关闭',
        droppableZones: [
            {
                _id: '1',
                name: '已关闭'
            },
            {
                _id: '2',
                name: '已归档'
            }
        ]
    }
];

export const items: ThyBoardCard[] = [
    {
        _id: '1',
        title: '项目1',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '2',
        title: '项目2',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '3',
        title: '项目3',
        laneIds: ['2'],
        entryIds: ['2'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '4',
        title: '项目4',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '5',
        title: '项目5',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '6',
        title: '项目6',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '7',
        title: '项目7',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '8',
        title: '项目8',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '9',
        title: '项目9',
        laneIds: ['2'],
        entryIds: ['2'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '10',
        title: '项目10',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '11',
        title: '项目11',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '12',
        title: '项目12',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '13',
        title: '项目13',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '14',
        title: '项目14',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '15',
        title: '项目15',
        laneIds: ['2'],
        entryIds: ['2'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '16',
        title: '项目16',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '17',
        title: '项目17',
        laneIds: ['4'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '18',
        title: '项目18',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '19',
        title: '项目19',
        laneIds: ['1'],
        entryIds: ['2'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '20',
        title: '项目20',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '21',
        title: '项目21',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '22',
        title: '项目22',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '23',
        title: '项目23',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '24',
        title: '项目24',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '25',
        title: '项目25',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '26',
        title: '项目26',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '27',
        title: '项目27',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '28',
        title: '项目28',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '29',
        title: '项目29',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '30',
        title: '项目30',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '31',
        title: '项目31',
        laneIds: [''],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '32',
        title: '项目32',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '33',
        title: '项目33',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '34',
        title: '项目34',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '35',
        title: '项目35',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
    {
        _id: '36',
        title: '项目36',
        laneIds: ['1'],
        entryIds: ['1'],
        height: Math.floor(Math.random() * 100 + 100)
    },
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
    },
    {
        _id: '4',
        name: '泳道4'
    },
    {
        _id: '5',
        name: '泳道5'
    },
    {
        _id: '6',
        name: '泳道6'
    },
    {
        _id: '7',
        name: '泳道7'
    },
    {
        _id: '8',
        name: '泳道8'
    },
    {
        _id: '9',
        name: '泳道9'
    }
];
