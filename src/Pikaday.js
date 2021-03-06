var React = require('react');
var Pikaday = require('pikaday');
var update = require('react-addons-update');

var ReactPikaday = React.createClass({

  propTypes: {
    value: React.PropTypes.instanceOf(Date),
    onChange: React.PropTypes.func,

    valueLink: React.PropTypes.shape({
      value: React.PropTypes.instanceOf(Date),
      requestChange: React.PropTypes.func.isRequired
    })
  },

  getValueLink: function(props) {
    return props.valueLink || {
      value: props.value,
      requestChange: props.onChange
    };
  },

  setDateIfChanged: function(newDate, prevDate) {
    var newTime = newDate ? newDate.getTime() : null;
    var prevTime = prevDate ? prevDate.getTime() : null;

    if ( newTime !== prevTime ) {
      if ( newDate === null ) {
        // Workaround for pikaday not clearing value when date set to falsey
        this.refs.pikaday.value = '';
      }
      this._picker.setDate(newDate, true);  // 2nd param = don't call onSelect
    }
  },

  componentDidMount: function() {
    var el = this.refs.pikaday;
    var opts = update({}, { $merge: this.props.options || {} });

    opts.field = el;
    opts.onSelect = this.getValueLink(this.props).requestChange;

    this._picker = new Pikaday(opts);

    this.setDateIfChanged(this.getValueLink(this.props).value);
  },

  componentWillReceiveProps: function(nextProps) {
    var newDate = this.getValueLink(nextProps).value;
    var lastDate = this.getValueLink(this.props).value;

    this.setDateIfChanged(newDate, lastDate);
  },

  render: function() {
    const propsWithoutValue = {};

    // Want to forward all props on to input component except the value
    // since pikaday will be in control of the value, not us
    for (var prop in this.props) {
      if (this.props.hasOwnProperty(prop) && prop !== 'value') {
        propsWithoutValue[prop] = this.props[prop];
      }
    }

    return (
      <input type="text" ref="pikaday" {...propsWithoutValue} />
    );
  }
});

module.exports = ReactPikaday;
