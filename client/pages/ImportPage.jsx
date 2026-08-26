import { useRef, useState } from 'react';
import api from '../api';

const DEFAULTS = { freshness: 80, decayPerHour: 1.5, list: true };