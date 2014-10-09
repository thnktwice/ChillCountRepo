Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    'header': { to: 'header' },
    'footer': { to: 'footer' }
  }
});