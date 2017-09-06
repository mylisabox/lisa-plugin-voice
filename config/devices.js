const template = require('../widgets/voice.json')

module.exports = [
  {
    pairing: 'custom',
    name: {
      en: 'L.I.S.A. voice command',
      fr: 'Commande vocale L.I.S.A.'
    },
    description: {
      en: 'Add a standalone L.I.S.A. voice command ',
      fr: 'Ajout d\'un module de commande volcale autonome L.I.S.A.'
    },
    driver: 'voice',
    type: 'other',
    template: template,
    image: 'voice.png'
  }
]
