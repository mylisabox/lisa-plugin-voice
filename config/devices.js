const template = require('../widgets/projector.json')

module.exports = [
  {
    pairing: 'settings',
    name: {
      en: 'Sony VPL projector',
      fr: 'Projecteur Sony VPL'
    },
    description: {
      en: 'Add Sony VPL projector',
      fr: 'Ajout d\'un projecteur Sony VPL'
    },
    driver: 'vpl',
    image: 'projector.png',
    settings: [
      {
        controlType: 'textbox',
        type: 'hidden',
        name: 'template',
        defaultValue: template,
        required: true
      },
      {
        controlType: 'textbox',
        type: 'url',
        name: 'address',
        label: {
          en: 'IP address'
        },
        required: true
      },
      {
        controlType: 'textbox',
        type: 'number',
        name: 'port',
        label: {
          en: 'Port'
        },
        defaultValue: 53484,
        required: true
      }
    ]
  }
]
