import { createApp, h } from 'vue'

import 'uno.css'
import './index.css'

import { App } from './App'

const $app = document.getElementById('app')

createApp(h(App)).mount($app)
