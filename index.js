
function rotate(appkit, args) {
  let task = appkit.terminal.task(`Rotating the secure key on ${args.app} and attached apps`);
  appkit.api.get(`/apps/${args.app}/addons`, (err, addons) => {
    if(err) {
      task.end('err')
      return appkit.terminal.error(err)
    }
    let securekey = addons.filter((x) => x.addon_service.name === 'securekey')
    if(securekey.length === 1) {
      task.end('err')
      return appkit.terminal.error({code:404, message:"Unable to find an owned secure key addon on this app, if secure key is attached and not owned, re-run this on the app that owns it."})
    }
    appkit.api.post(null, `/apps/${args.app}/addons/${securekey.name}/actions/rotate`, (err) => {
      if(err) {
        task.end('err')
        return appkit.terminal.error(err)
      }
      task.end('ok')
    })
  })
}

module.exports = {
  init:function(appkit) {
    let create_options = {
      'app':{
        'alias':'a',
        'demand':true,
        'type':'string',
        'description':'The application to act on.'
      }
    };
    appkit.args
      .command('securekey:rotate', 'rotate the secure key on thi sapp', {}, rotate.bind(null, appkit))
  },
  update:function(){},
  group:'securekey',
  help:'Rotate a secure key on an app',
  primary:true
};