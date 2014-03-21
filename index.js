/** @jsx React.DOM */

'use strict';

var _ = require('lodash-contrib');
var contentful = require('contentful');
var React = require('react/addons');
var Router = require('react-router-component');
var Link = Router.Link;
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;
var Promise = require('bluebird');

var cosmonautClient = contentful.createClient({
  space: 'h5qeox8yai6s',
  accessToken: '03744b36793a9ff1e7281709d4fc9ff6178af87b6b900be7ac22c1d6fcc74e8e'
});

function getUniqueColor(total, index) {
  var hue = Math.round(255 * (index/total));
  return 'hsl(' + hue + ',90%,65%)';
}

var Cosmonaut = React.createClass({
  handleNavComOpen: function(spaceId, accessToken) {
    this.refs.router.navigate('/navcom/' + spaceId + '/key/' + accessToken);
  },

  render: function() {
    return (
      <div>
        <div className="music-controls">
          <a href="http://www.youtube.com/watch?v=cSZ55X3X4pk" target="_blank">Carl Sagan - The Music of the Cosmos Television Series</a> <CosmosMusic videoId="cSZ55X3X4pk" autoplay={false} loop={true} />
        </div>
        <Locations ref="router">
          <Location path="/" handler={StarChart} onNavComOpen={this.handleNavComOpen} />
          <Location path="/help" handler={Help} />
          <Location path="/navcom/:spaceId/key/:accessToken" handler={NavCom} />
          <NotFound handler={VacuumFound} />
        </Locations>
      </div>
    );
  }
});

var CosmosMusic = React.createClass({
  propTypes: {
    videoId: React.PropTypes.string.isRequired,
    autoplay: React.PropTypes.bool,
    loop: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      autoplay: true,
      loop: true
    };
  },

  getInitialState: function() {
    return {
      playing: this.props.autoplay
    };
  },

  render: function() {
    var url =
      'https://www.youtube.com/embed/' + this.props.videoId +
      '?autoplay=' + (this.props.autoplay ? 1 : 0) +
      '&loop=' + (this.props.loop ? 1 : 0);

    return (
      <span>
        <button
          onClick={this.togglePlaying}>
          {this.state.playing ? '◼' : '▶'}
        </button>
        {this.state.playing && <iframe src={url} style={{display: 'none'}} />}
      </span>
    );
  },

  togglePlaying: function() {
    this.setState({playing: !this.state.playing});
  }
});

var Help = React.createClass({
  render: function() {
    return (
      <div className="star-chart">
        <h1 className="star-chart-title">HELP</h1>
        <p>So we want a <strong>Space ID</strong> and an <strong>API Key Access Token</strong> from you.</p>
        <p>You are wondering: "I certainily am <em>not</em> a rocket scientist. What is all that?"</p>
        <h2>INTERMISSION</h2>
        <p>So there are' two possible choices for you:</p>
        <ol>
          <li>You have a Contentful account</li>
          <li>You <strong>do not</strong> have a Contentful account</li>
        </ol>
        <h2>You <strong>do have</strong> a Contentful Account</h2>
        <p>
          Magnificent! You probably already have a Space you want to explore:
          All you need now is the Space's ID and an API Key's access token!
        </p>
        <p>
          <em>"What?"</em>, you say! Let me show you how to get this in two screenshots:
        </p>
        <ol>
          <li><a href="/help-space-id.png" target="_blank">Get the Space ID</a></li>
          <li><a href="/help-api-key-access-token.png" target="_blank">Get the API Key Access Token</a></li>
        </ol>
        <h2>You <strong>do NOT have</strong> a Contentful Account</h2>
        <p>You can get an account from <a href="https://www.contentful.com/" target="_blank">here</a>.</p>
        <p>Or use someone else's public Space and API Key, e.g., try "Fill in Contentful Example API" on the <Link href="/">Login page</Link>.</p>
      </div>
    );
  }
});

var StarChart = React.createClass({
  propTypes: {
    onNavComOpen: React.PropTypes.func.isRequired
  },

  handleSubmit: function() {
    var spaceId = this.refs.spaceIdInput.getDOMNode().value;
    var accessToken = this.refs.accessTokenInput.getDOMNode().value;

    this.props.onNavComOpen(spaceId, accessToken);

    return false;
  },

  fillExampleForm: function() {
    this.refs.spaceIdInput.getDOMNode().value = 'cfexampleapi';
    this.refs.accessTokenInput.getDOMNode().value = 'b4c0n73n7fu1';
  },

  render: function() {
    return (
      <div className="star-chart">
        <h1 className="star-chart-title">COSMONAUT</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input className="star-chart-main-input" ref="spaceIdInput" type="text" placeholder="Space ID" />
            <input className="star-chart-main-input" ref="accessTokenInput" type="text" placeholder="API Key Access Token" />
          </div>
          <button className="star-chart-main-input">Engage</button>
        </form>
        <a href="#" onClick={this.fillExampleForm}>Fill in Contentful Example API</a> / <Link href="/help">Space ID? Access Token? What?</Link>
      </div>
    );
  }
});

var NavCom = React.createClass({
  propTypes: {
    spaceId: React.PropTypes.string.isRequired,
    accessToken: React.PropTypes.string.isRequired
  },

  componentDidMount: function() {
    var client = contentful.createClient({
      space: this.props.spaceId,
      accessToken: this.props.accessToken
    });

    Promise.props({
      space: client.space(),
      contentTypes: client.contentTypes({
        limit: 100,
        order: 'sys.createdAt'
      })
    }).then(function(state) {
      this.setState(state);
    }.bind(this));
  },

  getInitialState: function() {
    return {
      space: {}
    };
  },

  render: function() {
    var spaceName = _.getPath(this.state, ['space', 'name']);
    var contentTypes = _.map(this.state.contentTypes, function(contentType, index) {
      var color = getUniqueColor(this.state.contentTypes.length, index);
      return <ContentType contentType={contentType} color={color} key={contentType.sys.id} />;
    }.bind(this));

    return (
      <div>
        <h1>{spaceName}</h1>
        <ul>{contentTypes}</ul>
      </div>
    );
  }
});

var ContentType = React.createClass({
  render: function() {
    var fields = _.map(this.props.contentType.fields, function(field) {
      return <li><span className="field-type-name">{field.type}</span> {field.name}</li>
    });
    return (
      <div>
        <h1 style={{color: this.props.color}}>
          {this.props.contentType.name}
        </h1>
        <ul>
          {fields}
        </ul>
      </div>
    );
  }
});

var VacuumFound = React.createClass({
  render: function() {
    return (
      <div>
        <h1>
          There is a lot of emptiness in the Cosmos.
        </h1>
        <h2>
          And <em>you</em> have found it!
        </h2>
        <p>
          Or have you found… nothing?
        </p>
        <p>
          Can it be nothing if we can <em>think</em> of it?
        </p>
        <p>
          <em>Can it be nothing if it has a URL?</em>
        </p>
        <p>
          Dark thoughts.
        </p>
        <p>
          Better we <Link href="/">Praise the Sun</Link>.
        </p>
        <p>
          <small>
            Oh, by the way: emptiness means Leerheit in German.
          </small>
        </p>
      </div>
    );
  }
});

React.renderComponent(
  <Cosmonaut />,
  document.body
);
