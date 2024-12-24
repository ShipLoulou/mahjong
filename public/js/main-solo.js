import Initialization from "./class/Initialization.js";
import { dataPiece, dataFigure } from "./data/data.js";
import Adapter from "./class/adapter.js";
import VerificationTouch from "./class/VerificationTouch.js";

new Initialization(dataPiece, dataFigure);
new VerificationTouch();
new Adapter;