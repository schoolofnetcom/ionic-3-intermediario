import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CameraListPage } from '../camera-list/camera-list';

/**
 * Generated class for the CameraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  myPhoto: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private filePath: FilePath,
    private platform: Platform,
    private sqlite: SQLite
  ) {
  }

  ngOnInit() {
    this.sqlite.create({
      name:'data.db',
      location: 'default'
    })
      .then((db:SQLiteObject) => {
        db.executeSql('CREATE TABLE photos(url VARCHAR(250))', {})
          .then(()=> console.log('table created'))
          .catch(e => console.log(e));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  choosePhoto() {
    let actionSheet = this.actionSheet.create({
      title: 'Selecione uma imagem',
      buttons: [
        {
          text: 'Tirar foto',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA, this.camera.MediaType.PICTURE);
          }
        },
        {
          text: 'Escolher foto',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.PICTURE);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  saveImage() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('insert into photos (url) values ("' + this.myPhoto + '")', {})
      })
      .then(() => {
        this.navCtrl.push(CameraListPage)
      })
      .catch(e => console.log(e));
  }

  private takePhoto(source: number = 1, mediaType: number = 0) {
    const options: CameraOptions = {
      quality: 100,
      mediaType: mediaType,
      sourceType: source,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG
    };
    this.camera.getPicture(options)
      .then((imageData) => {
        if (source == 0 && this.platform.is('android')) {
          this.filePath.resolveNativePath(imageData)
            .then((filePath) => {
              this.myPhoto = filePath;
            })
        } else {
          this.myPhoto = imageData;
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

}
