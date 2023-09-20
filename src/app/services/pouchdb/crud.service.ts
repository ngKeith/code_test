import { Injectable, EventEmitter } from '@angular/core';

declare function emit(val: any): any;
declare function emit(key: any, value: any): any;
declare var require: any;

@Injectable({
  providedIn: 'root',
})
export class DbService {
  public pouchdb: any;
  output: EventEmitter<string> = new EventEmitter();
  outputFail: EventEmitter<string> = new EventEmitter();

  constructor() {
    var PouchDB = require('pouchdb-browser');

    let db = PouchDB.default.defaults();

    this.pouchdb = new db('appdata', { revs_limit: 1, auto_compaction: true });
  }

  checkToUpdateOrSave(id: string, rev: string) {
    return this.pouchdb
      .get(id)
      .then((doc: any) => {
        if (doc.server_rev != rev) {
          return Promise.resolve(doc._rev);
        }
        return Promise.resolve(false);
      })
      .catch(function () {
        return Promise.resolve(true);
      });
  }

  updateDocFromServer(doc: any): boolean {
    let current = this;
    return this.checkToUpdateOrSave(doc._id, doc._rev).then(function (
      res: any
    ) {
      if (res) {
        if (typeof res === 'string' || res instanceof String) {
          doc.server_rev = doc._rev;
          doc._rev = res;
        } else {
          doc.server_rev = doc._rev;
          delete doc._rev;
        }
        current.pouchdb.put(doc).catch(function (err: any) {
          console.log('failed to update doc');
        });
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * updates a document in the database. IF the document doesn't exist, it will create a document for you
   * if the docAttributes is in use, the function will update the chosen attribute in the document
   * USE arrays when stipulating docAttributes for both docAttributes and dataToSave
   * you cannot use the docAttribute parameter when the document hasn't been created
   * the function will return a true or false indicating whether or not the information has been updated into the database
   */
  public async updateDoc(
    dataToSave: any,
    docName?: string,
    docAttributes?: Array<string>,
    append?: boolean,
    attachment?: any,
    server?: boolean
  ) {
    var promise = new Promise<boolean>((resolve, reject) => {
      var current = this;

      if (docName == undefined || docName == '') {
        docName = dataToSave._id;
      }

      this.pouchdb
        .get(docName)
        .then(function (doc: any) {
          if (docAttributes != undefined) {
            let c = 0;
            docAttributes.forEach(function (value) {
              if (append == true) {
                if (typeof dataToSave[c] === 'object') {
                  doc[value].push(...dataToSave[c]);
                  c++;
                } else {
                  doc[value].push(dataToSave[c]);
                  c++;
                }
              } else {
                doc[value] = dataToSave[c];
                c++;
              }
            });
            current.pouchdb
              .put(doc)
              .then((res: any) => {
                if (attachment != undefined) {
                  let param1 = attachment[0];
                  let param2 = attachment[1];
                  let param3 = attachment[2];
                  let param4 = attachment[3];
                  current
                    .addAttachment(param1, param2, param3, param4)
                    .then((res) => {
                      resolve(true);
                    });
                } else {
                  resolve(true);
                }
              })
              .catch(function (err: any) {
                if (err.status == 409) {
                  var counter = 1000;

                  setTimeout(() => {
                    counter++;

                    current.pouchdb.get(docName).then(function (doc: any) {
                      if (docAttributes != undefined) {
                        let c = 0;
                        docAttributes.forEach(function (value) {
                          if (append == true) {
                            if (typeof dataToSave[c] === 'object') {
                              for (var i = 0; i < dataToSave[c].length; i++) {
                                doc[value].push(dataToSave[c][i]);
                                c++;
                              }
                            } else {
                              doc[value].push(dataToSave[c]);
                              c++;
                            }
                          } else {
                            doc[value] = dataToSave[c];
                            c++;
                          }
                        });
                        current.pouchdb
                          .put(doc)
                          .then((res: any) => {
                            resolve(true);
                          })
                          .catch(function (err: any) {
                            reject('problems');
                          });
                      } else {
                        dataToSave._id = docName;
                        dataToSave._rev = doc._rev;

                        current.pouchdb.put(dataToSave).then((res: any) => {
                          resolve(true);
                        });
                      }
                    });
                  }, counter);
                }
              });
          } else {
            dataToSave._id = docName;
            if (server == true) {
              dataToSave.server_rev = dataToSave._rev;
            }
            dataToSave._rev = doc._rev;

            current.pouchdb.put(dataToSave).then((res: any) => {
              resolve(true);
            });
          }
        })
        .catch(function (err: any) {
          if (err.name === 'not_found') {
            if (docAttributes == undefined) {
              dataToSave._id = docName;
              if (server == true) {
                dataToSave.server_rev = dataToSave._rev;
              }
              current.pouchdb
                .put(dataToSave)
                .then(function (response: any) {
                  resolve(true);
                })
                .catch(function (err: any) {
                  resolve(false);
                });
            } else {
              let newDataPackage: any = {};
              newDataPackage['_id'] = docName;
              if ((dataToSave.length = docAttributes.length)) {
                for (var i = 0; i < dataToSave.length; i++) {
                  newDataPackage[docAttributes[i]] = dataToSave[i];
                }
                current.pouchdb
                  .put(newDataPackage)
                  .then(function (response: any) {
                    resolve(true);
                  })
                  .catch(function (err: any) {
                    resolve(false);
                  });
              } else {
                resolve(false);
              }
            }
          } else {
            resolve(false);
          }
        });
    });
    return Promise.resolve(promise);
  }

  /**
   * fetches a document from the database with the docId field provided
   * an empty object will be returned if the document is not present
   */
  public readDoc(docId: string, attachments?: boolean) {
    var promise = new Promise((resolve, reject) => {
      if (attachments) {
        this.pouchdb
          .get(docId)
          .then(function (doc: any) {
            resolve(doc);
          })
          .catch(function (err: any) {
            resolve({});
          });
      } else {
        this.pouchdb
          .get(docId)
          .then(function (doc: any) {
            resolve(doc);
          })
          .catch(function (err: any) {
            resolve({});
          });
      }
    });
    return promise;
  }

  public removeDocArrayItem(
    docId: string,
    attribute: string,
    listItem: any,
    index?: number
  ) {
    var promise = new Promise((resolve, reject) => {
      this.readDocAttribute(docId, attribute).then((res: any) => {
        if (res.constructor === Array) {
          let new_list = [];
          if (index != undefined) {
            new_list = res;
            new_list.splice(index, 1);
          } else {
            new_list = res.filter((e) => e !== listItem);
          }
          this.updateDoc([new_list], docId, [attribute]).then((res: any) => {
            resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    });
    return promise;
  }

  public getAttachment(docId: string, attachmentName: string) {
    var promise = new Promise((resolve, reject) => {
      this.pouchdb.getAttachment(docId, attachmentName).then((blob: Blob) => {
        resolve(blob);
      });
    });
    return promise;
  }

  public removeAttachment(id: string, docName: string) {
    var promise = new Promise((resolve, reject) => {
      var current = this;

      this.readDoc(id).then((doc: any) => {
        this.pouchdb
          .removeAttachment(id, docName, doc['_rev'])
          .then(function () {
            resolve(true);
          });
      });
    });
    return promise;
  }

  public readDocAttribute(docId: string, attrId: string) {
    var promise = new Promise((resolve, reject) => {
      this.pouchdb
        .get(docId)
        .then(function (doc: any) {
          let attribute = doc[attrId];
          resolve(attribute);
        })
        .catch(function (err: any) {
          resolve(null);
        });
    });
    return promise;
  }

  emitSuccessOutputEvent(outputText: string) {
    this.output.emit(outputText);
  }

  emitFailureOutputEvent(outputText: string) {
    this.outputFail.emit(outputText);
  }

  getOutputEvent() {
    return this.output;
  }

  getFailedOutputEvent() {
    return this.outputFail;
  }

  /**
   * add a file to the db. These files can be in the form of images, document, audio and video
   * multiple different file types inputs can be saved to the db
   */
  public addAttachment(
    dataToSave: Blob,
    id: string,
    docType: string,
    docName: string
  ) {
    var promise = new Promise((resolve, reject) => {
      var current = this;

      this.readDoc(id).then((doc: any) => {
        this.pouchdb
          .putAttachment(id, docName, doc['_rev'], dataToSave, docType)
          .then(function () {
            resolve(current.pouchdb.get(id, { attachments: true }));
          })
          .catch(function (err: any) {
            resolve(false);
          });
      });
    });
    return promise;
  }

  public addAttachmentMany(docName: string, files: any) {
    var promise = new Promise((resolve, reject) => {
      var current = this;
      this.readDoc(docName).then((doc: any) => {
        for (var key in doc['_attachments']) {
          files[key] = doc['_attachments'][key];
        }
        doc['_attachments'] = files;
        doc['_id'] = docName;
        doc['_rev'] = doc['_rev'];
        this.pouchdb.put(doc).then(function () {
          resolve(current.pouchdb.get(docName, { attachments: true }));
        });
      });
    });
    return promise;
  }

  public deleteDoc(docName: string) {
    var promise = new Promise((resolve, reject) => {
      this.readDoc(docName).then((doc: any) => {
        if (Object.keys(doc).length === 0 && doc.constructor === Object) {
          resolve(true);
        } else {
          var current = this;
          current.pouchdb.remove(doc);
          resolve(true);
        }
      });
    });
    return promise;
  }
}
