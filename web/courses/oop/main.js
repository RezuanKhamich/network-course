import { startCourse } from '../../assets/js/engine.js';
import { MODULES, UPCOMING, GLOSSARY } from './content.js';
import * as course from './course.js';

startCourse({ ...course, MODULES, UPCOMING, GLOSSARY });
