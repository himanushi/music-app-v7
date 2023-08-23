import { IonContent, IonHeader, IonItem, IonToolbar } from "@ionic/react";
import { Page } from "~/components";
import { markdown } from "~/lib";

export const CookiePolicy = () => {
  const html = markdown(content());

  return (
    <Page>
      <IonHeader class="ion-no-border">
        <IonToolbar />
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          {typeof html === "string" && (
            <div
              className="ion-padding"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </IonItem>
      </IonContent>
    </Page>
  );
};

const content = () => `
# クッキーポリシー
ゲーム音楽( https://video-game-music.net )(以下「当ページ」と言います。)で提供するサービス(以下、「当サービス」といいます。)のクッキーポリシー(以下、「当クッキーポリシー」といいます。)を定めます。

## はじめに
当ページをご利用する場合は、まず当クッキーポリシーをご一読ください。ユーザーが当ページの閲覧を継続する場合は、当クッキーポリシーに同意したものといたします。当クッキーポリシーにご同意いただけない場合は、ブラウザの設定等により、クッキーを無効にしていただきますようお願いいたします。なお、クッキーを無効にされた場合は、当ページの一部の機能をご利用いただけない可能性があります。

## クッキー(Cookie)とは
クッキーとは、ユーザーのコンピューターやタブレット、スマートフォンなどのインターネット接続可能な機器内に保存される情報のことをいいます。
当ページでは、セッションクッキー及びパーシステントクッキーと呼ばれるクッキーを利用しています。セッションクッキーは、当ページを閲覧している期間において一時的に保存されるもので、パーシステントクッキーは、当ページを閲覧後もユーザーのコンピューターやタブレット、スマートフォン等に保存され、指定した有効期限又はユーザーが手動で削除するまで期間、保存されるものです。

## 当ページでのクッキーの利用について
当ページでは、ユーザーの利便性の向上及びサービスの品質維持・向上を目的として、主に以下の用途でクッキーを使用しています。なお、ユーザーの個人情報を取得する目的では使用していません。
* 最適なウェブサイトの表示、サービス向上のため(文字サイズの変更等)
* ユーザーが入力された情報を管理するため(マイ・ポートフォリオの銘柄登録等)
* ウェブサイトのアクセス状況の統計的な調査・分析のため(Google Analytics)

## Google Analytics の利用について
当ページでは、当ページの利用状況を把握するために Google 社の提供するサービスである Google Analytics を利用しています。Google Analytics は、当サービスが発行するクッキーを利用して当ページの利用状況を分析します。当サービスは、 Google 社からその分析結果(ユーザー属性とインタレストカテゴリに関する Google Analytics レポートなど)を受け取り、当ページの利用状況を把握しております。
Google Analytics により収集、記録、分析された情報には、特定の個人を識別する情報は一切含まれておりません。また、それらの情報は、 Google 社により同社のプライバシーポリシーに基づいて管理されます。

## クッキーの管理、削除方法について
ユーザーがご利用になっているコンピューターやタブレット、スマートフォンのブラウザの設定を変更することにより、クッキーを無効することができます。また、保存されているクッキーを削除することができます。
クッキーを無効にしても当ページをご利用いただけますが、一部の機能をご利用いただけない場合があります。
ブラウザの設定変更の方法につきましては、各ブラウザ提供元のサイトをご参照ください。

以上

2020年9月14日制定
`;
