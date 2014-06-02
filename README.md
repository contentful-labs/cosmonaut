# COSMONAUT

Cosmonaut is an app for exploring the structure of Contentful Spaces.

It was created as a project in Contentful's first hackathon.

A Space is a container for content in
[Contentful](https://www.contentful.com). Contentful is an API-based
content management system for web and mobile apps. The Content Model
is the structure of a Space: The types and the rules of content. It
defines what kind of content can go into a Space and what the
relationships between chunks of content are.

Cosmonaut is based on [React.js](http://facebook.github.io/react/) and
uses [browserify](https://github.com/substack/node-browserify) for
bundling.

## [View demo](https://contentful.github.io/cosmonaut)

## Install

```
npm install
```

## Usage

Run development server:

```
npm run serve
```

Go to http://localhost:9966/

## Build

```
npm run build
```

Results in `bundle.js` and `bundle.min.js`
