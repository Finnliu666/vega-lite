import {isObject} from 'vega-util';
import {AxisConfigMixins} from './axis';
import {CompositeMarkConfigMixins, getAllCompositeMarks, getCompositeMarkParts} from './compositemark/index';
import {VL_ONLY_GUIDE_CONFIG} from './guide';
import {defaultLegendConfig, LegendConfig} from './legend';
import {Mark, MarkConfigMixins, PRIMITIVE_MARKS, VL_ONLY_MARK_CONFIG_PROPERTIES, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX} from './mark';
import * as mark from './mark';
import {ProjectionConfig} from './projection';
import {defaultScaleConfig, ScaleConfig} from './scale';
import {defaultConfig as defaultSelectionConfig, SelectionConfig} from './selection';
import {StackOffset} from './stack';
import {extractTitleConfig} from './title';
import {TopLevelProperties} from './toplevelprops';
import {duplicate, keys, mergeDeep} from './util';
import {VgMarkConfig, VgScheme, VgTitleConfig} from './vega.schema';


export interface ViewConfig {
  /**
   * The default width of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) x-scale or ordinal x-scale with `rangeStep` = `null`.
   *
   * __Default value:__ `200`
   *
   */
  width?: number;

  /**
   * The default height of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) y-scale with `rangeStep` = `null`.
   *
   * __Default value:__ `200`
   *
   */
  height?: number;

  /**
   * Whether the view should be clipped.
   */
  clip?: boolean;

  // FILL_STROKE_CONFIG
  /**
   * The fill color.
   *
   * __Default value:__ (none)
   *
   */
  fill?: string;

  /**
   * The fill opacity (value between [0,1]).
   *
   * __Default value:__ (none)
   *
   */
  fillOpacity?: number;

  /**
   * The stroke color.
   *
   * __Default value:__ (none)
   *
   */
  stroke?: string;

  /**
   * The stroke opacity (value between [0,1]).
   *
   * __Default value:__ (none)
   *
   */
  strokeOpacity?: number;

  /**
   * The stroke width, in pixels.
   *
   * __Default value:__ (none)
   *
   */
  strokeWidth?: number;

  /**
   * An array of alternating stroke, space lengths for creating dashed or dotted lines.
   *
   * __Default value:__ (none)
   *
   */
  strokeDash?: number[];

  /**
   * The offset (in pixels) into which to begin drawing with the stroke dash array.
   *
   * __Default value:__ (none)
   *
   */
  strokeDashOffset?: number;
}

export const defaultViewConfig: ViewConfig = {
  width: 200,
  height: 200
};

export type RangeConfigValue = (number|string)[] | VgScheme | {step: number};

export type RangeConfig = RangeConfigProps & {[name: string]: RangeConfigValue};

export interface RangeConfigProps {
  /**
   * Default range for _nominal_ (categorical) fields.
   */
  category?: string[] | VgScheme;

  /**
   * Default range for diverging _quantitative_ fields.
   */
  diverging?: string[] | VgScheme;

  /**
   * Default range for _quantitative_ heatmaps.
   */
  heatmap?: string[] | VgScheme;

  /**
   * Default range for _ordinal_ fields.
   */
  ordinal?: string[] | VgScheme;

  /**
   * Default range for _quantitative_ and _temporal_ fields.
   */
  ramp?: string[] | VgScheme;

  /**
   * Default range palette for the `shape` channel.
   */
  symbol?: string[];
}

export interface VLOnlyConfig {
  /**
   * Default axis and legend title for count fields.
   *
   * __Default value:__ `'Number of Records'`.
   *
   * @type {string}
   */
  countTitle?: string;

  /**
   * Defines how Vega-Lite should handle invalid values (`null` and `NaN`).
   * - If set to `"filter"` (default), all data items with null values will be skipped (for line, trail, and area marks) or filtered (for other marks).
   * - If `null`, all data items are included. In this case, invalid values will be interpreted as zeroes.
   */
  invalidValues?: 'filter' | null;

  /**
   * Defines how Vega-Lite generates title for fields.  There are three possible styles:
   * - `"verbal"` (Default) - displays function in a verbal style (e.g., "Sum of field", "Year-month of date", "field (binned)").
   * - `"function"` - displays function using parentheses and capitalized texts (e.g., "SUM(field)", "YEARMONTH(date)", "BIN(field)").
   * - `"plain"` - displays only the field name without functions (e.g., "field", "date", "field").
   */
  fieldTitle?: 'verbal' | 'functional' | 'plain';

  /**
   * D3 Number format for axis labels and text tables. For example "s" for SI units. Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
   */
  numberFormat?: string;

  /**
   * Default datetime format for axis and legend labels. The format can be set directly on each axis and legend. Use [D3's time format pattern](https://github.com/d3/d3-time-format#locale_format).
   *
   * __Default value:__ `'%b %d, %Y'`.
   *
   */
  timeFormat?: string;


  /** Default properties for [single view plots](spec.html#single). */
  view?: ViewConfig;

  /**
   * Scale configuration determines default properties for all [scales](scale.html). For a full list of scale configuration options, please see the [corresponding section of the scale documentation](scale.html#config).
   */
  scale?: ScaleConfig;

  /** An object hash for defining default properties for each type of selections. */
  selection?: SelectionConfig;

  /** Default stack offset for stackable mark. */
  stack?: StackOffset;
}

export interface StyleConfigIndex {
  [style: string]: VgMarkConfig;
}


export interface Config extends TopLevelProperties, VLOnlyConfig, MarkConfigMixins, CompositeMarkConfigMixins, AxisConfigMixins {

  /**
   * An object hash that defines default range arrays or schemes for using with scales.
   * For a full list of scale range configuration options, please see the [corresponding section of the scale documentation](scale.html#config).
   */
  range?: RangeConfig;

  /**
   * Legend configuration, which determines default properties for all [legends](legend.html). For a full list of legend configuration options, please see the [corresponding section of in the legend documentation](legend.html#config).
   */
  legend?: LegendConfig;

  /**
   * Title configuration, which determines default properties for all [titles](title.html). For a full list of title configuration options, please see the [corresponding section of the title documentation](title.html#config).
   */
  title?: VgTitleConfig;

  /**
   * Projection configuration, which determines default properties for all [projections](projection.html). For a full list of projection configuration options, please see the [corresponding section of the projection documentation](projection.html#config).
   */
  projection?: ProjectionConfig;

  /** An object hash that defines key-value mappings to determine default properties for marks with a given [style](mark.html#mark-def).  The keys represent styles names; the values have to be valid [mark configuration objects](mark.html#config).  */
  style?: StyleConfigIndex;
}

export const defaultConfig: Config = {
  padding: 5,
  timeFormat: '%b %d, %Y',
  countTitle: 'Number of Records',

  invalidValues: 'filter',

  view: defaultViewConfig,

  mark: mark.defaultMarkConfig,
  area: {},
  bar: mark.defaultBarConfig,
  circle: {},
  geoshape: {},
  line: {},
  point: {},
  rect: {},
  rule: {color: 'black'}, // Need this to override default color in mark config
  square: {},
  text: {color: 'black'}, // Need this to override default color in mark config
  tick: mark.defaultTickConfig,
  trail: {},

  boxplot: {
    size: 14,
    extent: 1.5,
    box: {},
    median: {color: 'white'},
    outliers: {},
    whisker: {},
    ticks: null
  },

  scale: defaultScaleConfig,
  projection: {},
  axis: {},
  axisX: {},
  axisY: {minExtent: 30},
  axisLeft: {},
  axisRight: {},
  axisTop: {},
  axisBottom: {},
  axisBand: {},
  legend: defaultLegendConfig,

  selection: defaultSelectionConfig,
  style: {},

  title: {},
};

export function initConfig(config: Config) {
  return mergeDeep(duplicate(defaultConfig), config);
}

const MARK_STYLES = ['view', ...PRIMITIVE_MARKS] as ('view' | Mark)[];

const VL_ONLY_CONFIG_PROPERTIES: (keyof Config)[] = [
  'padding', 'numberFormat', 'timeFormat', 'countTitle',
  'stack', 'scale', 'selection', 'invalidValues',
  'overlay' as keyof Config // FIXME: Redesign and unhide this
];

const VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
  view: ['width', 'height'],
  ...VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
};

export function stripAndRedirectConfig(config: Config) {
  config = duplicate(config);

  for (const prop of VL_ONLY_CONFIG_PROPERTIES) {
    delete config[prop];
  }

  // Remove Vega-Lite only axis/legend config
  if (config.axis) {
    for (const prop of VL_ONLY_GUIDE_CONFIG) {
      delete config.axis[prop];
    }
  }
  if (config.legend) {
    for (const prop of VL_ONLY_GUIDE_CONFIG) {
      delete config.legend[prop];
    }
  }

  // Remove Vega-Lite only generic mark config
  if (config.mark) {
    for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
      delete config.mark[prop];
    }
  }

  for (const markType of MARK_STYLES) {
    // Remove Vega-Lite-only mark config
    for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
      delete config[markType][prop];
    }

    // Remove Vega-Lite only mark-specific config
    const vlOnlyMarkSpecificConfigs = VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[markType];
    if (vlOnlyMarkSpecificConfigs) {
      for (const prop of vlOnlyMarkSpecificConfigs) {
        delete config[markType][prop];
      }
    }

    // Redirect mark config to config.style so that mark config only affect its own mark type
    // without affecting other marks that share the same underlying Vega marks.
    // For example, config.rect should not affect bar marks.
    redirectConfig(config, markType);
  }

  for (const m of getAllCompositeMarks()) {
    for (const part of getCompositeMarkParts(m)) {
      // Remove Vega-Lite-only mark config
      for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
        if (config[m] && config[m][part]) {
          delete config[m][part][prop];
        }
      }
      // Re-direct all composite mark's part configs to config.style
      // For example, config.boxplot.whisker should become config.style.boxplot-whisker.
      redirectConfig(config, m, `${m}-${part}`, part);
    }
    // Clean up the composite mark config after redirecting all of it
    delete config[m];
  }

  // Redirect config.title -- so that title config do not
  // affect header labels, which also uses `title` directive to implement.
  redirectConfig(config, 'title', 'group-title');

  // Remove empty config objects
  for (const prop in config) {
    if (isObject(config[prop]) && keys(config[prop]).length === 0) {
      delete config[prop];
    }
  }

  return keys(config).length > 0 ? config : undefined;
}

function redirectConfig(
  config: Config,
  prop: Mark | 'title' | 'view' | string, // string = composite mark
  toProp?: string,
  compositeMarkPart?: string
) {
  const propConfig: VgMarkConfig =
    prop === 'title' ? extractTitleConfig(config.title).mark :
    compositeMarkPart ? config[prop][compositeMarkPart] :
    config[prop];

  if (prop === 'view') {
    toProp = 'cell'; // View's default style is "cell"
  }

  const style: VgMarkConfig = {
    ...propConfig,
    ...config.style[prop]
  };
  // set config.style if it is not an empty object
  if (keys(style).length > 0) {
    config.style[toProp || prop] = style;
  }

  if (!compositeMarkPart) {
    // For composite mark, so don't delete the whole config yet as we have to do multiple redirections.
    delete config[prop];
  }
}
