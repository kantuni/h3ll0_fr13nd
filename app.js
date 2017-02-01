/**
 * Created by Henrikh Kantuni, Shahen Kosyan, Nairen Cao, and Derek Acosta on 11/19/16.
 */


'use strict';

const Nightmare = require('nightmare');
const Promise = require('bluebird');
const Sequalize = require('sequelize');


const sql = new Sequalize('h3ll0_fr13nd', 'root', 'root', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql'
});

const users = sql.define('users', {
  phone_number: {type: Sequalize.STRING, primaryKey: true, allowNull: false},
  full_name: {type: Sequalize.STRING},
  avatar: {type: Sequalize.STRING}
}, {timestamps: false});

const browser = new Nightmare({show: true})
  .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14')
  .viewport(1366, 768);


/**
 * Fill in with zeros up to the given size
 * @param size
 * @return {string}
 */
Number.prototype.zfill = function (size) {
  let s = String(this);
  while (s.length < (size || 2)) {
    s = '0' + s;
  }
  return s;
};


/**
 * Find an account with the given number
 * via - Forgot account? -
 * @param number
 * @return {Object} with avatar, full_name, and phone_number fields
 */
function find_account(number) {
  return new Promise((resolve, reject) => {
    browser
      .cookies.clearAll()
      .goto('https://www.facebook.com/')
      .wait()
      .wait(1000)
      .click('.login_form_label_field a')
      .wait()
      .wait(2000)
      .type('#identify_email', number)
      .click('input[value="Search"]')
      .wait()
      .wait(2000)
      .evaluate((number) => {
        let results = document.querySelectorAll('.fsl.fwb.fcb'), full_name, avatar;

        if (results.length && results[0].innerHTML.trim().toLowerCase() !== 'no search results') {
          full_name = Array.prototype.map.call(results, (element) => {
            return element.innerHTML.trim();
          }).join(', ');

          avatar = document.querySelectorAll('img._s0._rw');

          if (avatar.length) {
            avatar = Array.prototype.map.call(avatar, (element) => {
              return element.src;
            }).join(', ');
          }
        }

        return {
          avatar: avatar,
          full_name: full_name,
          phone_number: number
        };
      }, number)
      .run((error, result) => {
        if (error) {
          console.log('oops');
          reject(error);
        }
        resolve(result);
      });
  });
}


/**
 * Find accounts and store them in the database
 */
function find_friends() {
  let start = 0, end = 9999999999;

  Promise.coroutine(function*() {
    for (let i = end; i >= start; i--) {
      console.log('+1' + (i).zfill(10));
      let result = yield find_account('+1' + (i).zfill(10));
      if (result.full_name) {
        console.log(result);

        let user = yield users.findAll({
          where: {
            phone_number: result.phone_number
          }
        });

        if (user.length === 0) {
          yield users.create(result);
        }
      }
    }
    yield browser.end();
  })();
}

find_friends();
