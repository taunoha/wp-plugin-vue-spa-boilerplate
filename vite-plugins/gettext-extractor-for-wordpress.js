
import fs from 'fs';
import {
  GettextExtractor,
  JsExtractors,
  HtmlExtractors,
} from "gettext-extractor";

const HTML_ATTRIBUTES = [
  "title",
  "alt",
  "placeholder",
  "label",
  "aria-label",
  "aria-description",
  "aria-placeholder",
];

const sanitizeText = (text) => text.replace(/\\/g, '\\\\')
  .replace(/\u0008/g, '\\b')
  .replace(/\t/g, '\\t')
  .replace(/\n/g, '\\n')
  .replace(/\f/g, '\\f')
  .replace(/\r/g, '\\r')
  .replace(/'/g, '\\\'')
  .replace(/"/g, '\\"');

export default function gettextExtractorForWordpress(options) {

  const opts = {
    path: '',
    context: '',
    domain: '',
    ...options
  };

  return {
    name: 'extractStrings',
    apply: 'build',
    buildStart() {
      var php = ['<?php', '', "defined('ABSPATH') or die();", '', 'return array('];
      var messages = [];

      if (this.meta.watchMode) {
        return;
      }

      const extractor = new GettextExtractor();

      const htmlAttributes = HTML_ATTRIBUTES.map((attribute) =>
        HtmlExtractors.elementAttribute("*", `:${attribute}`)
      );
    
      extractor.createHtmlParser(htmlAttributes).parseFilesGlob("./src/**/*.vue");

      extractor
        .createJsParser([
          JsExtractors.callExpression(['__'], {
            arguments: {
              text: 0,
            }
          }),
        ])
        .parseFilesGlob('./src/**/*.@(vue|js|ts)');

      extractor
        .createJsParser([
          JsExtractors.callExpression(['_n'], {
            arguments: {
              text: 0,
              textPlural: 1,
              context: 2
            }
          }),
        ])
        .parseFilesGlob('./src/**/*.@(vue|js|ts)');

      extractor
        .createJsParser([
          JsExtractors.callExpression(['_x'], {
            arguments: {
              text: 0,
              context: 1
            }
          }),
        ])
        .parseFilesGlob('./src/**/*.@(vue|js|ts)');

      extractor
        .createJsParser([
          JsExtractors.callExpression(['_nx'], {
            arguments: {
              text: 0,
              textPlural: 1,
              count: 2,
              context: 3
            }
          }),
        ])
        .parseFilesGlob('./src/**/*.@(vue|js|ts)');

      messages = extractor.getMessages();
      
      const messageKeys = new Set();

      const prepareEntity = (value) => {
        const { text, textPlural, context } = value;

        if( /^props?\./.test(text) ) {
          return;
        }

        let _text = text.replace(/^__\('(.+)'\)/, "$1");
        let _textPlural = textPlural ? textPlural.replace(/^__\('(.+)'\)/, "$1") : '';

        _text = sanitizeText(_text);
        _textPlural = sanitizeText(_textPlural);

        const key = context ? `${context}\u0004${_text}` : _text;

        if (messageKeys.has(key)) {
          return;
        }

        messageKeys.add(key);

        if( _textPlural ) {
          if( context ) {
            return `"${key}" => array(_x("${_text}", '${context}', '${opts.domain}'), _x("${_textPlural}", '${context}', '${opts.domain}')),`
          } else {
            return `"${key}" => array(__("${_text}", '${opts.domain}'), __("${_textPlural}", '${opts.domain}')),`
          }
        } else {
          if( context ) {
            return `"${key}" => array(_x("${_text}", '${context}', '${opts.domain}')),`
          } else {
            return `"${key}" => array(__("${_text}", '${opts.domain}')),`
          }
        }
      }

      messages.forEach((value) => {
        const entry = prepareEntity(value);

        if( entry ) {
          php.push(`  // ${value.references.join(', ')}`);
          php.push(`  ${entry}`);
        }

      });

      php.push(');');

      if (!fs.existsSync(opts.path)) {
        fs.mkdirSync(opts.path);
      }

      fs.writeFile(opts.path + '/messages.php', php.join("\r\n"), (err) => {
        if (err) throw err;
      });

      console.log(`✓ ${messages.length} string(s) extracted for WordPress.`);
    }
  }
}
