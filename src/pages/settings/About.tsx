import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { FooterPadding } from "~/components";
import { markdown } from "~/lib";

export const About = () => {
  const html = markdown(about({ version: "0.0.1" }));

  return (
    <IonPage>
      <IonHeader class="ion-no-border">
        <IonToolbar />
      </IonHeader>
      <IonContent>
        {typeof html === "string" && (
          <div
            className="ion-padding"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        <FooterPadding />
      </IonContent>
    </IonPage>
  );
};

const about = ({ version }: { version: string }) => `
# このアプリについて
## 概要
Apple Music で配信中のゲーム音楽を検索できるアプリです。Apple Music とライブラリの曲を再生することができます。

## 目的
ユーザー同士でゲーム音楽を楽しく共有できるよう開発を進めています。

## SNS, 開発プロジェクトなど
* [Twitter](https://twitter.com/vgm_net)
* [Treads](https://www.threads.net/@himanushi777)
* [note](https://note.com/himanushi/n/nd598a3d92a15)
* [Github](https://github.com/himanushi?tab=repositories)

## 問い合わせ
* [Q & A](https://note.com/himanushi/n/na2e56d4ee4d6)
* [Twitter にてダイレクトメッセージをお願いします](https://twitter.com/vgm_net)

#### ファイルバージョン
${version}
`;
