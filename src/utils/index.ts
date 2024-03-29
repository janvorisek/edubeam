import {
  Beam2D,
  BeamConcentratedLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  DofID,
  LinearStaticSolver,
  Load,
  NodalLoad,
  Node,
  PrescribedDisplacement,
} from "ts-fem";
import { Ref } from "vue";
import { availableLocales, i18n } from "../plugins/i18n";
import { useProjectStore } from "../store/project";
import { Command, IKeyValue, undoRedoManager } from "../CommandManager";
import { useViewerStore } from "../store/viewer";

import { XMLParser } from "fast-xml-parser";
import { loadType } from "./loadType";

export type EntityWithLabel = { label: string & { [key: string]: unknown } };

export { throttle } from "./throttle";
export { debounce } from "./debounce";

export { serializeModel } from "./serializeModel";
export { deserializeModel } from "./serializeModel";

export { smoothPath } from "./smoothPath";
export { loadType } from "./loadType";

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const checkNumber = (e: KeyboardEvent) => {
  if (e.key === "Escape") if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  const isNumber = !isNaN(e.key as unknown as number);

  const isActionKey =
    (e.ctrlKey && e.key === "a") ||
    (e.ctrlKey && e.key === "c") ||
    (e.ctrlKey && e.key === "v") ||
    (e.ctrlKey && e.key === "x") ||
    e.key === "Escape" ||
    e.key === "Delete" ||
    e.key === "Backspace" ||
    e.key === "Enter" ||
    e.key === "Tab" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "End" ||
    e.key === "Home" ||
    e.key === "e" ||
    e.key === "-";

  const isComma = e.key === "," || e.key === ".";

  if (isNumber || isActionKey || isComma) return;

  e.stopPropagation();
  e.preventDefault();
};

export const loadXmlFile = () => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (tagName) =>
      ["Material", "CrossSection", "Node", "Beam2d", "LoadCase", "NodalLoad", "ElementLoad"].includes(tagName),
  });
  const jObj = parser.parse(`<?xml version="1.0" ?>
  <!--
  EduBeam session
  saved in version 3.4.3 on 2017-01-10 at 21h:02m:45s
  -->
  <session version="3.4.3">
    <domain cName="Domain">
      <materials>
        <Material alpha="1.2e-05" d="1.0" domain="domain" e="30000000.0" g="10000000.0" label="DefaultMat"/>
      </materials>
      <crossSects>
        <CrossSection a="0.06" domain="domain" dyz="0.0" h="0.3" iy="0.00045" iz="0.0002" j="1.0" k="1000.0" label="DefaultCS"/>
      </crossSects>
      <nodes>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[0.0, 0.0, 1.0]" domain="domain" label="24"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[1.5, 0.0, 1.0]" domain="domain" label="25"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[3.0, 0.0, 1.0]" domain="domain" label="26"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[5.0, 0.0, 1.0]" domain="domain" label="27"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[13.0, 0.0, -2.0]" domain="domain" label="20"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[-5.0, 0.0, 1.0]" domain="domain" label="21"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-3.5, 0.0, 1.0]" domain="domain" label="22"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[-2.0, 0.0, 1.0]" domain="domain" label="23"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[6.5, 0.0, 1.0]" domain="domain" label="28"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[8.0, 0.0, 1.0]" domain="domain" label="29"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[3.0, 0.0, -5.0]" domain="domain" label="4"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[13.0, 0.0, -5.0]" domain="domain" label="8"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-2.0, 0.0, 10.0]" domain="domain" label="59"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[-5.0, 0.0, 12.0]" domain="domain" label="58"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[11.5, 0.0, 7.0]" domain="domain" label="55"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[10.0, 0.0, 7.0]" domain="domain" label="54"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-5.0, 0.0, 10.0]" domain="domain" label="57"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[13.0, 0.0, 7.0]" domain="domain" label="56"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[5.0, 0.0, 7.0]" domain="domain" label="51"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[3.0, 0.0, 7.0]" domain="domain" label="50"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[8.0, 0.0, 7.0]" domain="domain" label="53"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[6.5, 0.0, 7.0]" domain="domain" label="52"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[2.25, 0.0, 16.0]" domain="domain" label="88"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[5.75, 0.0, 16.0]" domain="domain" label="89"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[10.0, 0.0, 17.0]" domain="domain" label="82"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[11.5, 0.0, 15.0]" domain="domain" label="83"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[6.5, 0.0, 15.0]" domain="domain" label="80"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[8.0, 0.0, 17.0]" domain="domain" label="81"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-2.75, 0.0, 16.0]" domain="domain" label="86"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[0.75, 0.0, 16.0]" domain="domain" label="87"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[13.0, 0.0, 17.0]" domain="domain" label="84"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-4.25, 0.0, 16.0]" domain="domain" label="85"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[0.0, 0.0, -5.0]" domain="domain" label="3"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[10.0, 0.0, -5.0]" domain="domain" label="7"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[26.5, 0.0, -3.5]" domain="domain" label="100"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[5.0, 0.0, 4.0]" domain="domain" label="39"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[3.0, 0.0, 4.0]" domain="domain" label="38"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[-5.0, 0.0, 4.0]" domain="domain" label="33"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[13.0, 0.0, 1.0]" domain="domain" label="32"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[11.5, 0.0, 1.0]" domain="domain" label="31"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[10.0, 0.0, 1.0]" domain="domain" label="30"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[1.5, 0.0, 4.0]" domain="domain" label="37"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[0.0, 0.0, 4.0]" domain="domain" label="36"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[-2.0, 0.0, 4.0]" domain="domain" label="35"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-3.5, 0.0, 4.0]" domain="domain" label="34"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[-2.0, 0.0, 12.0]" domain="domain" label="60"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[0.0, 0.0, 12.0]" domain="domain" label="61"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[0.0, 0.0, 10.0]" domain="domain" label="62"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[3.0, 0.0, 10.0]" domain="domain" label="63"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[3.0, 0.0, 12.0]" domain="domain" label="64"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[5.0, 0.0, 12.0]" domain="domain" label="65"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[5.0, 0.0, 10.0]" domain="domain" label="66"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[8.0, 0.0, 10.0]" domain="domain" label="67"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[8.0, 0.0, 12.0]" domain="domain" label="68"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[10.0, 0.0, 12.0]" domain="domain" label="69"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-2.0, 0.0, -5.0]" domain="domain" label="2"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[8.0, 0.0, -5.0]" domain="domain" label="6"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[28.0, 0.0, -4.0]" domain="domain" label="99"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[25.0, 0.0, -3.0]" domain="domain" label="98"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[10.75, 0.0, 16.0]" domain="domain" label="91"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[7.25, 0.0, 16.0]" domain="domain" label="90"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[15.0, 0.0, -3.0]" domain="domain" label="93"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[12.25, 0.0, 16.0]" domain="domain" label="92"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[16.5, 0.0, -3.5]" domain="domain" label="95"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[18.0, 0.0, -4.0]" domain="domain" label="94"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[23.0, 0.0, -4.0]" domain="domain" label="97"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[20.0, 0.0, -3.0]" domain="domain" label="96"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-3.5, 0.0, -2.0]" domain="domain" label="11"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[-2.0, 0.0, -2.0]" domain="domain" label="10"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[3.0, 0.0, -2.0]" domain="domain" label="13"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[0.0, 0.0, -2.0]" domain="domain" label="12"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[5.0, 0.0, -2.0]" domain="domain" label="15"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[1.5, 0.0, -2.0]" domain="domain" label="14"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[6.5, 0.0, -2.0]" domain="domain" label="17"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[8.0, 0.0, -2.0]" domain="domain" label="16"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[11.5, 0.0, -2.0]" domain="domain" label="19"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[10.0, 0.0, -2.0]" domain="domain" label="18"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[0.0, 0.0, 7.0]" domain="domain" label="48"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[1.5, 0.0, 7.0]" domain="domain" label="49"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[-3.5, 0.0, 7.0]" domain="domain" label="46"/>
        <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[-2.0, 0.0, 7.0]" domain="domain" label="47"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[13.0, 0.0, 4.0]" domain="domain" label="44"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[-5.0, 0.0, 7.0]" domain="domain" label="45"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[10.0, 0.0, 4.0]" domain="domain" label="42"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[11.5, 0.0, 4.0]" domain="domain" label="43"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[6.5, 0.0, 4.0]" domain="domain" label="40"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[8.0, 0.0, 4.0]" domain="domain" label="41"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[-5.0, 0.0, -5.0]" domain="domain" label="1"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[5.0, 0.0, -5.0]" domain="domain" label="5"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[-5.0, 0.0, -2.0]" domain="domain" label="9"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[1.5, 0.0, 15.0]" domain="domain" label="77"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[0.0, 0.0, 17.0]" domain="domain" label="76"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[-2.0, 0.0, 17.0]" domain="domain" label="75"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[-5.0, 0.0, 17.0]" domain="domain" label="74"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[-3.5, 0.0, 15.0]" domain="domain" label="73"/>
        <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[13.0, 0.0, 12.0]" domain="domain" label="72"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[13.0, 0.0, 10.0]" domain="domain" label="71"/>
        <Node bcs="{'Y': False, 'x': False, 'z': False}" coords="[10.0, 0.0, 10.0]" domain="domain" label="70"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[5.0, 0.0, 17.0]" domain="domain" label="79"/>
        <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[3.0, 0.0, 17.0]" domain="domain" label="78"/>
      </nodes>
      <elements>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, True]" label="58" mat="DefaultMat" nodes="['87', '88']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="30" mat="DefaultMat" nodes="['46', '47']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="28" mat="DefaultMat" nodes="['43', '44']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="29" mat="DefaultMat" nodes="['45', '46']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="60" mat="DefaultMat" nodes="['89', '80']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, False]" label="61" mat="DefaultMat" nodes="['80', '90']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="62" mat="DefaultMat" nodes="['90', '81']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, True]" label="63" mat="DefaultMat" nodes="['89', '90']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="64" mat="DefaultMat" nodes="['82', '91']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="65" mat="DefaultMat" nodes="['91', '83']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, False]" label="66" mat="DefaultMat" nodes="['83', '92']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="67" mat="DefaultMat" nodes="['92', '84']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, True]" label="68" mat="DefaultMat" nodes="['91', '92']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="69" mat="DefaultMat" nodes="['93', '95']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="34" mat="DefaultMat" nodes="['52', '53']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="24" mat="DefaultMat" nodes="['37', '38']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="25" mat="DefaultMat" nodes="['39', '40']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="26" mat="DefaultMat" nodes="['40', '41']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="27" mat="DefaultMat" nodes="['42', '43']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="20" mat="DefaultMat" nodes="['31', '32']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="21" mat="DefaultMat" nodes="['33', '34']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="48" mat="DefaultMat" nodes="['70', '71']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="49" mat="DefaultMat" nodes="['74', '85']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="46" mat="DefaultMat" nodes="['69', '70']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="23" mat="DefaultMat" nodes="['36', '37']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="44" mat="DefaultMat" nodes="['67', '66']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="45" mat="DefaultMat" nodes="['68', '67']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="42" mat="DefaultMat" nodes="['64', '63']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="43" mat="DefaultMat" nodes="['66', '65']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="40" mat="DefaultMat" nodes="['62', '61']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="41" mat="DefaultMat" nodes="['63', '62']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="1" mat="DefaultMat" nodes="['1', '2']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="35" mat="DefaultMat" nodes="['54', '55']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="3" mat="DefaultMat" nodes="['5', '6']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="2" mat="DefaultMat" nodes="['3', '4']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="5" mat="DefaultMat" nodes="['9', '11']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="4" mat="DefaultMat" nodes="['7', '8']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="7" mat="DefaultMat" nodes="['12', '14']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="6" mat="DefaultMat" nodes="['11', '10']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="9" mat="DefaultMat" nodes="['15', '17']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="8" mat="DefaultMat" nodes="['14', '13']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="18" mat="DefaultMat" nodes="['28', '29']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="13" mat="DefaultMat" nodes="['21', '22']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="12" mat="DefaultMat" nodes="['19', '20']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="73" mat="DefaultMat" nodes="['100', '99']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="72" mat="DefaultMat" nodes="['98', '100']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="71" mat="DefaultMat" nodes="['96', '97']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="70" mat="DefaultMat" nodes="['95', '94']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="15" mat="DefaultMat" nodes="['24', '25']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="32" mat="DefaultMat" nodes="['49', '50']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="14" mat="DefaultMat" nodes="['22', '23']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="11" mat="DefaultMat" nodes="['18', '19']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="10" mat="DefaultMat" nodes="['17', '16']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="39" mat="DefaultMat" nodes="['60', '59']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="38" mat="DefaultMat" nodes="['57', '59']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="59" mat="DefaultMat" nodes="['79', '89']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="22" mat="DefaultMat" nodes="['34', '35']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="17" mat="DefaultMat" nodes="['27', '28']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="16" mat="DefaultMat" nodes="['25', '26']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="19" mat="DefaultMat" nodes="['30', '31']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="54" mat="DefaultMat" nodes="['87', '76']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="31" mat="DefaultMat" nodes="['48', '49']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, False]" label="56" mat="DefaultMat" nodes="['77', '88']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, True]" label="51" mat="DefaultMat" nodes="['86', '73']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="36" mat="DefaultMat" nodes="['55', '56']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[True, True]" label="53" mat="DefaultMat" nodes="['86', '85']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="52" mat="DefaultMat" nodes="['75', '86']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="33" mat="DefaultMat" nodes="['51', '52']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="55" mat="DefaultMat" nodes="['77', '87']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="37" mat="DefaultMat" nodes="['58', '57']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="47" mat="DefaultMat" nodes="['71', '72']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="57" mat="DefaultMat" nodes="['88', '78']"/>
        <Beam2d cs="DefaultCS" domain="domain" hinges="[False, False]" label="50" mat="DefaultMat" nodes="['85', '73']"/>
      </elements>
      <loadCases>
        <LoadCase domain="domain" label="Default_loadcase">
          <NodalLoad label="F_2" loadCase="Default_loadcase" value="{'fx': 0.0, 'fz': 0.0, 'my': -5.0}" where="6"/>
          <NodalLoad label="F_11" loadCase="Default_loadcase" value="{'fx': 1.5811, 'fz': 4.7434, 'my': 0.0}" where="95"/>
          <NodalLoad label="F_4" loadCase="Default_loadcase" value="{'fx': 0.0, 'fz': 0.0, 'my': -5.0}" where="17"/>
          <NodalLoad label="F_5" loadCase="Default_loadcase" value="{'fx': 1.0, 'fz': 5.0, 'my': 0.0}" where="22"/>
          <NodalLoad label="F_6" loadCase="Default_loadcase" value="{'fx': 0.0, 'fz': 0.0, 'my': -5.0}" where="28"/>
          <NodalLoad label="F_7" loadCase="Default_loadcase" value="{'fx': 1.0, 'fz': 5.0, 'my': 0.0}" where="34"/>
          <NodalLoad label="F_1" loadCase="Default_loadcase" value="{'fx': 1.0, 'fz': 5.0, 'my': 0.0}" where="2"/>
          <NodalLoad label="F_10" loadCase="Default_loadcase" value="{'fx': 5.0, 'fz': 1.0, 'my': 0.0}" where="57"/>
          <NodalLoad label="F_3" loadCase="Default_loadcase" value="{'fx': 1.0, 'fz': 5.0, 'my': 0.0}" where="11"/>
          <NodalLoad label="F_8" loadCase="Default_loadcase" value="{'fx': 0.0, 'fz': 0.0, 'my': -5.0}" where="40"/>
          <NodalLoad label="F_9" loadCase="Default_loadcase" value="{'fx': 0.0, 'fz': 0.0, 'my': -5.0}" where="51"/>
          <ElementLoad label="L_12" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="24"/>
          <ElementLoad label="L_14" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="28"/>
          <ElementLoad label="L_15" loadCase="Default_loadcase" value="{'DistF': 0.75, 'Fx': 1.0, 'Fz': 5.0, 'dTg': 0, 'dTc': 0, 'magnitude': 0, 'perX': False, 'type': 'Force', 'dir': None}" where="29"/>
          <ElementLoad label="L_16" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="31"/>
          <ElementLoad label="L_36" loadCase="Default_loadcase" value="{'DistF': 1.5811, 'dTc': 0, 'Fz': 4.7434, 'dTg': 0, 'Fx': 1.5811, 'magnitude': 0, 'perX': False, 'type': 'Force', 'dir': None}" where="71"/>
          <ElementLoad label="L_17" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="35"/>
          <ElementLoad label="L_29" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="55"/>
          <ElementLoad label="L_28" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="54"/>
          <ElementLoad label="L_25" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="50"/>
          <ElementLoad label="L_24" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="49"/>
          <ElementLoad label="L_27" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="52"/>
          <ElementLoad label="L_26" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="51"/>
          <ElementLoad label="L_21" loadCase="Default_loadcase" value="{'DistF': 0, 'dTc': 0.0, 'Fz': 0, 'dTg': 30.0, 'Fx': 0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="46"/>
          <ElementLoad label="L_20" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'X'}" where="43"/>
          <ElementLoad label="L_23" loadCase="Default_loadcase" value="{'DistF': 0, 'dTc': 0.0, 'Fz': 0, 'dTg': 30.0, 'Fx': 0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="47"/>
          <ElementLoad label="L_22" loadCase="Default_loadcase" value="{'DistF': 0, 'dTc': 0.0, 'Fz': 0, 'dTg': 30.0, 'Fx': 0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="48"/>
          <ElementLoad label="L_2" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="4"/>
          <ElementLoad label="L_3" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Z'}" where="7"/>
          <ElementLoad label="L_1" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Z'}" where="2"/>
          <ElementLoad label="L_6" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="12"/>
          <ElementLoad label="L_7" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Z'}" where="15"/>
          <ElementLoad label="L_4" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Z'}" where="8"/>
          <ElementLoad label="L_5" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="11"/>
          <ElementLoad label="L_8" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Z'}" where="16"/>
          <ElementLoad label="L_9" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="19"/>
          <ElementLoad label="L_13" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="27"/>
          <ElementLoad label="L_32" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="64"/>
          <ElementLoad label="L_33" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="65"/>
          <ElementLoad label="L_30" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'X'}" where="59"/>
          <ElementLoad label="L_31" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'X'}" where="60"/>
          <ElementLoad label="L_10" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="20"/>
          <ElementLoad label="L_37" loadCase="Default_loadcase" value="{'DistF': 0, 'dTc': 0, 'Fz': 0, 'dTg': 0, 'Fx': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Local Z'}" where="72"/>
          <ElementLoad label="L_34" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="66"/>
          <ElementLoad label="L_35" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="67"/>
          <ElementLoad label="L_38" loadCase="Default_loadcase" value="{'DistF': 0, 'dTc': 0, 'Fz': 0, 'dTg': 0, 'Fx': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Local Z'}" where="73"/>
          <ElementLoad label="L_18" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 30.0, 'dTc': 25.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': None}" where="36"/>
          <ElementLoad label="L_19" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': False, 'type': 'Uniform', 'dir': u'Z'}" where="41"/>
          <ElementLoad label="L_11" loadCase="Default_loadcase" value="{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': 5.0, 'perX': True, 'type': 'Uniform', 'dir': u'Z'}" where="23"/>
        </LoadCase>
      </loadCases>
    </domain>
  </session>`);

  // Parse materials
  if (jObj.session.domain.materials) {
    for (const material of jObj.session.domain.materials.Material) {
      const label = material["@_label"];
      const d = parseFloat(material["@_d"]);
      const e = parseFloat(material["@_e"]);
      const g = parseFloat(material["@_g"]);
      const alpha = parseFloat(material["@_alpha"]);

      useProjectStore().solver.domain.createMaterial(label, { d, e, g, alpha });
    }
  }

  // Parse cross sections
  if (jObj.session.domain.crossSects) {
    for (const cs of jObj.session.domain.crossSects.CrossSection) {
      const label = cs["@_label"];
      const a = parseFloat(cs["@_a"]);
      const iy = parseFloat(cs["@_iy"]);
      const h = parseFloat(cs["@_h"]);
      const k = parseFloat(cs["@_k"]);

      useProjectStore().solver.domain.createCrossSection(label, { a, iy, h, k });
    }
  }

  // Parse nodes
  if (jObj.session.domain.nodes) {
    for (const node of jObj.session.domain.nodes.Node) {
      const label = node["@_label"];
      const coords = JSON.parse(node["@_coords"]);

      // Parse bcs
      const bcs = [];
      const _bcs = JSON.parse(node["@_bcs"].replace(/'/g, '"').replace(/False/g, "false").replace(/True/g, "true"));
      if ("x" in _bcs && _bcs["x"] === true) bcs.push(DofID.Dx);
      if ("y" in _bcs && _bcs["y"] === true) bcs.push(DofID.Dy);
      if ("z" in _bcs && _bcs["z"] === true) bcs.push(DofID.Dz);
      if ("X" in _bcs && _bcs["X"] === true) bcs.push(DofID.Rx);
      if ("Y" in _bcs && _bcs["Y"] === true) bcs.push(DofID.Ry);
      if ("Z" in _bcs && _bcs["Z"] === true) bcs.push(DofID.Rz);

      useProjectStore().solver.domain.createNode(label, coords, bcs);
    }
  }

  // Parse elements
  if (jObj.session.domain.elements) {
    for (const element of jObj.session.domain.elements.Beam2d) {
      const label = element["@_label"];
      const nodes = JSON.parse(element["@_nodes"].replace(/'/g, '"'));
      const mat = element["@_mat"];
      const cs = element["@_cs"];
      const hinges = JSON.parse(element["@_hinges"].replace(/False/g, "false").replace(/True/g, "true"));

      useProjectStore().solver.domain.createBeam2D(label, nodes, mat, cs, hinges);
    }
  }

  // Parse load cases
  if (jObj.session.domain.loadCases) {
    for (const loadCase of jObj.session.domain.loadCases.LoadCase) {
      const label = loadCase["@_label"];
      const domain = loadCase["@_domain"];

      if (loadCase.NodalLoad) {
        for (const load of loadCase.NodalLoad) {
          const target = load["@_where"];
          const _values = JSON.parse(load["@_value"].replace(/'/g, '"'));
          const values = {
            [DofID.Dx]: _values.fx ?? 0,
            [DofID.Dz]: _values.fz ?? 0,
            [DofID.Ry]: _values.my ?? 0,
          };

          useProjectStore().solver.loadCases[0].createNodalLoad(target, values);
        }
      }

      if (loadCase.ElementLoad) {
        for (const load of loadCase.ElementLoad) {
          const target = load["@_where"];
          const _values = JSON.parse(
            load["@_value"]
              .replace(/u'/g, "'")
              .replace(/None/g, "null")
              .replace(/'/g, '"')
              .replace(/False/g, "false")
              .replace(/True/g, "true")
          );
          const values = [_values.fx ?? 0, _values.fz ?? 0];

          useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(target, values, true);
        }
      }
    }
  }
};

export const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const exportJSON = () => {
  const nodes = [...useProjectStore().solver.domain.nodes.values()].map((n) => {
    return {
      label: n.label,
      coords: n.coords,
      bcs: [...n.bcs.values()],
      lcs: n.lcs,
    };
  });

  const elements = [...useProjectStore().solver.domain.elements.values()].map((e) => {
    return {
      label: e.label,
      nodes: e.nodes,
      mat: e.mat,
      cs: e.cs,
      hinges: e.hinges,
    };
  });

  const materials = [...useProjectStore().solver.domain.materials.values()].map((m) => {
    return {
      label: m.label,
      d: m.d,
      e: m.e,
      g: m.g,
      alpha: m.alpha,
    };
  });

  const crossSections = [...useProjectStore().solver.domain.crossSections.values()].map((cs) => {
    return {
      label: cs.label,
      a: cs.a,
      iy: cs.iy,
      h: cs.h,
      k: cs.k,
    };
  });

  const loadCases = [...useProjectStore().solver.loadCases].map((lc) => {
    return {
      label: lc.label,
      nodalLoads: lc.nodalLoadList.map((nl) => {
        return {
          target: nl.target,
          values: nl.values,
        };
      }),
      elementLoads: lc.elementLoadList.map((el) => {
        return {
          type: loadType(el),
          target: el.target,
          values: el.values,
        };
      }),
      prescribedBC: lc.prescribedBC.map((pbc) => {
        return {
          target: pbc.target,
          prescribedValues: pbc.prescribedValues,
        };
      }),
    };
  });

  return {
    edubeam: true,
    date: new Date(),
    version: APP_VERSION,
    commit: APP_COMMIT,
    domain: {
      materials,
      crossSections,
      nodes,
      elements,
      loadCases,
    },
  };
};

export const importJSON = (json: any) => {
  const jObj = json;

  // Parse materials
  if (jObj.domain.materials) {
    for (const material of jObj.domain.materials) {
      useProjectStore().solver.domain.createMaterial(material.label, material);
    }
  }

  // Parse cross sections
  if (jObj.domain.crossSections) {
    for (const cs of jObj.domain.crossSections) {
      useProjectStore().solver.domain.createCrossSection(cs.label, cs);
    }
  }

  // Parse nodes
  if (jObj.domain.nodes) {
    for (const node of jObj.domain.nodes) {
      const n = useProjectStore().solver.domain.createNode(node.label, node.coords, node.bcs);

      if (node.lcs) n.updateLcs({ locx: node.lcs[0], locy: node.lcs[1] });
    }
  }

  // Parse elements
  if (jObj.domain.elements) {
    for (const element of jObj.domain.elements) {
      useProjectStore().solver.domain.createBeam2D(
        element.label,
        element.nodes,
        element.mat,
        element.cs,
        element.hinges
      );
    }
  }

  // Parse load cases
  if (jObj.domain.loadCases) {
    for (const loadCase of jObj.domain.loadCases) {
      useProjectStore().solver.loadCases[0].label = loadCase.label;

      for (const nl of loadCase.nodalLoads) {
        useProjectStore().solver.loadCases[0].createNodalLoad(nl.target, nl.values);
      }

      for (const el of loadCase.elementLoads) {
        if (!("type" in el) || el.type === "udl")
          useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(el.target, el.values, true);
        else if ("type" in el && el.type === "concentrated")
          useProjectStore().solver.loadCases[0].createBeamConcentratedLoad(el.target, el.values, true);
        else if ("type" in el && el.type === "temperature")
          useProjectStore().solver.loadCases[0].createBeamTemperatureLoad(el.target, el.values);
      }

      for (const pbc of loadCase.prescribedBC) {
        useProjectStore().solver.loadCases[0].createPrescribedDisplacement(pbc.target, pbc.prescribedValues);
      }
    }
  }
};

export const suggestLanguage = () => {
  const langs = navigator.languages || [navigator.language];

  for (const lang of langs) {
    if (availableLocales.some((l) => l.code === lang)) return lang;
  }

  return "en";
};

export const parseFloat2 = (s: string | number) => {
  s = s.toString();

  if (s === "") return 0;
  if (s === "-") return 0;

  s = s.replaceAll(/\s/g, "");

  let tmp = parseFloat(s.replace(",", "."));

  tmp = isNaN(tmp) ? 0 : tmp;

  return tmp;
};

export const setUnsolved = () => {
  useProjectStore().solver.loadCases[0].solved = false;
};

export const solve = () => {
  useProjectStore().solve();
};

export const swapNodes = (el: Beam2D) => {
  el.nodes = el.nodes.reverse();

  el.hinges = [el.hinges[1], el.hinges[0]];
  solve();
};

export const formatScientificNumber = (n: number) => {
  if (n > 1000 || n < 0.001) return n.toExponential(4);

  return n;
};

export const changeSetArrayItem = (
  item: unknown,
  set: string,
  value: number,
  el?: HTMLInputElement,
  formatter?: (v: number) => number
) => {
  setUnsolved();

  const prevVal = item[set][value];

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return (el.value = item[set][value]);

  if (formatter) item[set][value] = formatter(val);
  else item[set][value] = val;

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        value.item[value.set][value.value] = value.next as number;
        solve();
      },
      (value) => {
        value.item[value.set][value.value] = value.prev as number;
        solve();
      },
      { item, set, value, prev: prevVal, next: item[set][value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const changeRefNumValue = (value: string) => {
  const val = parseFloat(value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return 0;

  return val;
};

export const numberRules = [
  (v: string) => {
    if (v === "") return i18n.global.t("validators.enterValue");

    const tmp = v.replace(/\s/g, "").replace(",", ".");

    // isNaN accepts a string, the types are wrong
    if (isNaN(tmp as unknown as number)) return i18n.global.t("validators.invalidNumber");

    return true;
  },
];

export const changeItem = (item: object, value: string, el?: HTMLInputElement, formatter?: (v: number) => number) => {
  setUnsolved();

  const prevVal = item[value];

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  //if (isNaN(val)) return (el.value = item[value]);

  if (formatter) item[value] = formatter(val);
  else item[value] = val;

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        value.item[value.value] = value.next as number;
        solve();
      },
      (value) => {
        value.item[value.value] = value.prev as number;
        solve();
      },
      { item, value, prev: prevVal, next: item[value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const changeLabel = (map: string, item: EntityWithLabel, el?: HTMLInputElement) => {
  setUnsolved();

  const _showLoads = useViewerStore().showLoads;
  useViewerStore().showLoads = false;

  //if (isNaN(parseInt(el.value))) return;
  if (useProjectStore().solver.domain[map].has(el.value)) {
    alert("ERROR: Label " + el.value + " already used!");
    el.value = item.label;
    return;
  }

  const prevId = item.label;

  item.label = el.value;
  useProjectStore().solver.domain[map].set(item.label, item);

  if (map === "nodes") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      const idtomodify = element.nodes.findIndex((nid) => nid == prevId);
      if (idtomodify > -1) {
        element.nodes[idtomodify] = item.label;
      }
    }

    for (const load of useProjectStore().solver.loadCases[0].nodalLoadList) {
      if (load.target == prevId) {
        load.target = item.label;
      }
    }
  }

  if (map === "elements") {
    for (const load of useProjectStore().solver.loadCases[0].elementLoadList) {
      if (load.target == prevId) {
        load.target = item.label;
      }
    }
  }

  if (map === "materials") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      if (element.mat == prevId) {
        element.mat = item.label;
      }
    }
  }

  if (map === "crossSections") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      if (element.cs == prevId) {
        element.cs = item.label;
      }
    }
  }

  // delete current
  useProjectStore().solver.domain[map].delete(prevId);

  useViewerStore().showLoads = _showLoads;

  solve();
};

export const toggleSet = (item: unknown, set: string, value: number) => {
  setUnsolved();

  const prevVal = new Set(Array.from(item[set]));

  if (item[set].has(value)) item[set].delete(value);
  else item[set].add(value);

  item[set] = new Set(item[set].values());

  const nextVal = new Set(Array.from(item[set]));

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item[value.set] = value.next;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item[value.set] = value.prev;
        solve();
      },
      { item, set, prev: prevVal, next: nextVal }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const toggleArray = (item: unknown, set: string, value: number) => {
  setUnsolved();

  const prevVal = item[set][value];
  item[set][value] = !item[set][value];

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item[value.set][value.value] = value.next as number;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item[value.set][value.value] = value.prev as number;
        solve();
      },
      { item, set, value, prev: prevVal, next: item[set][value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const toggleBoolean = (item: unknown, value: string) => {
  setUnsolved();
  const prevVal = item[value];

  item[value] = !item[value];

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item[value.value] = value.next as number;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item[value.value] = value.prev as number;
        solve();
      },
      { item, value, prev: prevVal, next: item[value] }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  solve();
};

export const deleteElement = (id: string) => {
  setUnsolved();

  // delete element load
  for (const lc of useProjectStore().solver.loadCases) {
    for (let i = 0; i < lc.elementLoadList.length; i++) {
      if (lc.elementLoadList[i].target === id) {
        lc.elementLoadList.splice(i, 1);
        i--;
      }
    }
  }

  // Remove from selections
  const index = useProjectStore().selection2.elements.indexOf(id);
  if (index > -1) useProjectStore().selection2.elements.splice(index, 1);
  useProjectStore().clearSelection();

  useProjectStore().solver.domain.elements.delete(id);

  solve();
};

export const deleteNode = (id: string) => {
  setUnsolved();
  useProjectStore().clearSelection();

  // delete elements first
  for (const [key, value] of useProjectStore().solver.domain.elements) {
    if (value.nodes[0] === id || value.nodes[1] === id) {
      deleteElement(key);
    }
  }

  // delete all loads on this node
  for (const loadCase of useProjectStore().solver.loadCases) {
    loadCase.solved = false;
    for (let i = loadCase.nodalLoadList.length - 1; i >= 0; i--) {
      if (loadCase.nodalLoadList[i].target === id) {
        loadCase.nodalLoadList.splice(i, 1);
      }
    }

    for (let i = loadCase.prescribedBC.length - 1; i >= 0; i--) {
      if (loadCase.prescribedBC[i].target === id) {
        loadCase.prescribedBC.splice(i, 1);
      }
    }
  }

  // Remove from selections
  const index = useProjectStore().selection2.nodes.indexOf(id);
  if (index > -1) useProjectStore().selection2.nodes.splice(index, 1);
  useProjectStore().clearSelection();

  useProjectStore().solver.domain.nodes.delete(id);

  solve();
};

export const deleteMaterial = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.materials.delete(id);
  solve();
};

export const deleteCrossSection = (id: string) => {
  setUnsolved();
  useProjectStore().solver.domain.crossSections.delete(id);
  solve();
};

export const deleteNodalLoad = (load: NodalLoad, id: number) => {
  setUnsolved();
  useProjectStore().clearSelection();
  const _id =
    id -
    useProjectStore().solver.loadCases[0].elementLoadList.length -
    useProjectStore().solver.loadCases[0].prescribedBC.length;
  useProjectStore().solver.loadCases[0].nodalLoadList.splice(_id, 1);
  solve();
};

export const deleteElementLoad = (load: BeamElementUniformEdgeLoad, id: number) => {
  setUnsolved();
  useProjectStore().clearSelection();
  useProjectStore().solver.loadCases[0].elementLoadList.splice(id, 1);
  solve();
};

export const deletePrescribedDisplacement = (load: BeamElementUniformEdgeLoad, id: number) => {
  setUnsolved();
  useProjectStore().clearSelection();
  const _id = id - useProjectStore().solver.loadCases[0].elementLoadList.length;
  useProjectStore().solver.loadCases[0].prescribedBC.splice(_id, 1);
  solve();
};

export const nameBeamForce = (dof: number) => {
  if (dof === 0) return "X";
  if (dof === 1) return "Z";
  if (dof === 2) return "M";
  if (dof === 3) return "X";
  if (dof === 4) return "Z";
  if (dof === 5) return "M";
  return "";
};

export function decimalCount(number) {
  // Convert to String
  const numberAsString = number.toString();
  // String Contains Decimal
  if (numberAsString.includes(".")) {
    return numberAsString.split(".")[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
}

export function float2String(v: number) {
  const numDec = decimalCount(v);
  let s = v.toString();
  if (numDec > 15) s = s.substr(0, s.length - 1);

  // now count zeros at end
  let zeros = 0;
  for (let c = 1; c < numDec; c++) {
    if (s[s.length - c] === "0") zeros++;
    else break;
  }

  if (zeros > 0) return parseFloat(s.substr(0, s.length - zeros));

  return v;
}

export function isMobile(): boolean {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // Adjust this value as per your requirements
  const mobileScreenWidthThreshold = 768;

  return isMobile || screenWidth < mobileScreenWidthThreshold;
}
