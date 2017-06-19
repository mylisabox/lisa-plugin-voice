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
    type: 'other',
    template: template,
    image: 'projector.png',
    settings: [
      {
        controlType: 'textbox',
        type: 'ip',
        name: 'address',
        label: {
          en: 'IP address'
        },
        required: true,
        private: true
      },
      {
        controlType: 'textbox',
        type: 'number',
        name: 'port',
        label: {
          en: 'Port'
        },
        defaultValue: 53484,
        required: true,
        private: true
      }
    ]
  }
]
