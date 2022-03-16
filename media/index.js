
// const nodes = [];
// const links = [];
// const activeLinks = [];

// const graphLayout = document.getElementById('graph')
// // graphLayout.nodes = nodes
// graphLayout.links = links
// graphLayout.activeLinks = activeLinks

const graphView = window['graph-view'];

const quads = [
  {
    subject: { value: '1', termType: 'NamedNode' },
    predicate: { value: 'name', termType: 'NamedNode' },
    object: { value: 'Name', termType: 'Literal', datatype: { value: 'string' } },
  },
  {
    subject: { value: '1', termType: 'NamedNode' },
    predicate: { value: 'has', termType: 'NamedNode' },
    object: { value: 'car', termType: 'NamedNode' },
  },
  {
    subject: { value: 'car', termType: 'NamedNode' },
    predicate: { value: 'name', termType: 'NamedNode' },
    object: { value: 'Car', termType: 'Literal', datatype: { value: 'string' } },
  },
];
const dataset = quads;
dataset.match = (s, p, o) => quads.filter(({ subject, predicate, object }) => (
    (!s || s.value === subject.value) &&
    (!p || p.value === predicate.value) &&
    (!o || o.value === object.value)
));
const env = { shrink(url) { return url; } };

// graphView.render('#graph-view', { dataset, env });
graphView.renderText('#graph-view', { content, env });
