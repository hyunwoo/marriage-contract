import { Component, Vue } from 'vue-property-decorator';
import vis from 'vis';
import nodesData from '@/data/nodes_calced.json';
import edgesData from '@/data/edges.json';
import _ from 'lodash';

const min = _.minBy(nodesData, (node) => {
  if (_.isNil(node.birth) || _.isEmpty(node.birth)) {
    return Number.POSITIVE_INFINITY;
  }
  return node.birth;
});
const max = _.maxBy(nodesData, (node) => {
  if (_.isNil(node.death) || _.isEmpty(node.death)) {
    return Number.NEGATIVE_INFINITY;
  }
  return node.death;
});

const rangeMin = min ? _.toNumber(min.birth) : 0;
const rangeMax = max ? _.toNumber(max.death) : 2000;
const ColorSet = {
  edge: {
    Parent: '#3F51B5',
    Marriage: '#E91E63',
    Godparent: '#9C27B0',
    'Godparent(GG14 / 43)': '#9C27B0',
    'Godparent to Child of': '#9C27B0',
    'Godparent; Aunt': '#9C27B0',
    Sibling: '#2196F3',
    'Half Sibling': '#2196F3',
    Signatory: '#009688',
    'Signatory (marriage)': '#009688',
    'Signatory of Marriage Contract': '#009688',
    'Signatory (baptism)': '#009688',
    'Signatory(death)': '#009688',
    'Signatory(Marriage)': '#009688',
    'Signatory(burial)': '#009688',
    'Sibling; Godparent': '#009688'
  }
};
console.log('range Min Max', rangeMax, rangeMin);
interface Node {
  birth: string;
  death: string;
  id: string;
  label: string;
  listed: string;
  oscType: string;
  overseasConnection: string;
  proof: string;
  occupation: string;
  font: any;
  x: number;
  y: number;
  [key: string]: string | number;
}

interface Edge {
  date: string;
  label: string;
  sourcePerson: string;
  from: string;
  targetPerson: string;
  to: string;
  type: string;
  weight: string;
  size: number;
  font: any;
  color: string;
  [key: string]: string | number;
}

interface NetworkData {
  node: Node[];
  edge: Edge[];
}
interface NetworkDataSet {
  node: vis.DataSet<Node>;
  edge: vis.DataSet<Edge>;
}
@Component({})
export default class Network extends Vue {
  public $refs!: {
    network: HTMLElement;
  };

  public networkDataSet: NetworkDataSet = {
    // @ts-ignore
    node: undefined,
    // @ts-ignore
    edge: undefined
  };
  public ui = {
    rangeSlider: {
      min: rangeMin,
      max: rangeMax,
      values: [rangeMin, rangeMin + 10]
    },
    rangePlayer: {
      start: 0,
      range: 10
    },
    edge: {
      defaultSelected: ['Parent', 'Marriage'],
      selected: [],
      types: [
        'Parent',
        'Marriage',
        'Godparent',
        'Godparent(GG14 / 43)',
        'Godparent to Child of',
        'Godparent; Aunt',
        'Half Sibling',
        'Sibling',
        'Signatory',
        'Signatory (marriage)',
        'Signatory of Marriage Contract',
        'Signatory (baptism)',
        'Signatory(death)',
        'Signatory(Marriage)',
        'Signatory(burial)',
        'Sibling; Godparent'
      ]
    }
  };
  public nodes!: Node[];
  public edges!: Edge[];

  public network!: vis.Network;
  public changeSelectedRange = _.debounce((values) => {
    this.ui.rangeSlider.values = values;
    this.updateFilter();
  }, 100);
  public updateFilter() {
    console.log(this.ui.edge.selected);
    this.networkDataSet.edge.remove(_.map(this.edges, (edge) => edge.id));

    // const removeEdges = _.chain(this.edges)
    //   .filter((edge) => !_.some(selectedEdges, (name) => name === edge.label))
    //   .map((edge) => edge.id)
    //   .value();

    const displayEdges = _.chain(this.edges)
      .filter((edge) =>
        _.some(this.ui.edge.selected, (name) => name === edge.label)
      )
      .filter((edge) => {
        return (
          this.ui.rangeSlider.values[0] < _.toNumber(edge.date) &&
          _.toNumber(edge.date) < this.ui.rangeSlider.values[1]
        );
      })
      .value();

    this.networkDataSet.edge.add(displayEdges);
  }
  public changeSelectedEdgeType(selectedEdges: string[]) {
    // @ts-ignore
    this.ui.edge.selected = selectedEdges;
    this.updateFilter();
  }

  private extractNodes() {
    console.log('extract!');
    console.log(this.network.getPositions());
    console.log(this.nodes);
    const nodes = _.map(this.network.getPositions(), (node, k) => {
      const foundNode = _.find(
        this.nodes,
        (n) => _.toNumber(n.id) === _.toNumber(k)
      );
      if (foundNode === undefined) {
        return undefined;
      }
      foundNode.x = node.x;
      foundNode.y = node.y;
      return foundNode;
    });

    console.log(JSON.stringify(nodes));
    // this.init([], []);
  }

  private mounted() {
    // @ts-ignore
    // this.network.on('configChange', () => {});
    this.init(nodesData, edgesData);
  }

  private init(createNodeData, createEdgeData) {
    if (this.network) {
      this.network.destroy();
    }
    this.nodes = _.map(createNodeData, (node) => {
      return node;
    });

    this.networkDataSet.node = new vis.DataSet(this.nodes);

    // @ts-ignore
    this.edges = _.chain(createEdgeData)
      .map((edge) => {
        const color = ColorSet.edge[edge.Label];

        const ret = {
          date: edge.DATE,
          label: edge.Label,
          sourcePerson: edge['SOURCE PERSON'],
          from: edge.Source,
          targetPerson: edge['TARGET PERSON'],
          to: edge.Target,
          type: edge.Type,
          weight: edge.Weight,
          color: { color: ColorSet.edge[edge.Label], opacity: 1 },
          size: 3,
          arrows: edge.Label === 'Marriage' ? 'to, from' : 'from',
          font: {
            size: 10
          }
        };
        return ret;
      })
      .value();

    this.networkDataSet.edge = new vis.DataSet([]);
    // Marriage
    // Parent
    //

    // console.log(nodesSource);
    // const nodes = new vis.DataSet(nodesSource);
    // const edges = new vis.DataSet(edgesSource);
    // const edges = new vis.DataSet([]);
    // console.log(nodes);

    // create a network

    const data = {
      nodes: this.networkDataSet.node,
      edges: this.networkDataSet.edge
    };

    const options = {
      nodes: {
        shape: 'dot'
      },
      physics: {
        enabled: false
      },
      edges: {
        smooth: false
      },
      configure: true
    };
    this.network = new vis.Network(this.$refs.network, data, options);
  }
}
