import classes from "./LegalNoticeComponent.module.css";

function LegalNoticeComponent() {
  return (
    <section className={classes.ctr}>
      <div className={classes.column}>
        <div className={classes.wrap}>
          <div className={classes.heading}>
            <h2>Mentions Légales</h2>
          </div>
          <div className={classes.spacer}></div>
          <div className={classes.container}>
            <h4>Responsables</h4>
            <p>
              Responsable de la publication : Julie Baronnie <br></br>
            </p>
            <h4>Hébergement</h4>
            <p>
              Ce site est hébergé par Vercel.com
              <br></br>
              Sur les serveurs de la société : Vercel Inc. <br></br> Adresse web
              : https://vercel.com <br></br>
            </p>
            <h4>Licence</h4>
            <p>
              Sauf mention contraire, tous les textes de ce site sont protégés
              par la licence Creative Commons Attribution – Pas d’Utilisation
              Commerciale – Partage dans les Mêmes Conditions 4.0 International,
              ce qui signifie que vous êtes libres de reproduire, diffuser et
              communiquer cette création au public dans les conditions de la
              licence.
            </p>
            <h4>Données personnelles</h4>
            <p>
              Les informations que vous nous communiquez sont uniquement
              utilisées dans le cadre de l’envoi de la newsletter ou pour vous
              permettre de laisser des commentaires sur ce blog. En application
              des articles 38 et suivants de la loi du 6 janvier 1978, vous
              bénéficiez des droits d’accès, de rectification, de suppression et
              d’opposition aux informations vous concernant. Vous pouvez exercer
              ces droits en nous écrivant à l’adresse
              contact@juliebaronniebeauty.com
            </p>
            <h4>Commentaires</h4>
            <p>
              Vous êtes libre d’utiliser l’espace des commentaires. Nous nous
              réservons le droit d’appliquer une modération à ces commentaires
              afin de conserver une continuité de thèmes entre un article et les
              commentaires qui sont déposés sur cet article. Les propos
              interdits par la loi ne seront pas publiés ou seront supprimés.
            </p>
            <h4>Cookies</h4>
            <p>
              Nous vous informons également de la présence d’un cookie non
              détruit à la fin de votre consultation. Ce cookie nous permet
              d’affiner l’analyse de la fréquentation de notre site. Tous les
              résultats obtenus sont compilés et totalement anonymes. Dans tous
              les cas, vous avez le contrôle de ces cookies. Vous avez la
              possibilité de les lire, de les filtrer, de les refuser et de les
              détruire dans la configuration de votre navigateur interne comme
              suit :
            </p>
            <ul>
              <li>
                Sous Internet Explorer : Menu « Outils {">"} Options Internet ».
                Cliquez sur « Confidentialité » et choisissez « Bloquer tous les
                cookies ». Validez sur « OK »
              </li>
              <li>
                Sous Firefox : Menu « Outils {">"} Options ». Cliquez sur
                l’option « Vie privée » puis désactivez les cookies dans la
                rubrique « Cookies »
              </li>
              <li>
                Sous Chrome : Menu « Outils ». Cliquez sur « Effacer les données
                de navigation » et choisissez « Supprimer les cookies et autres
                données de site et de plug-in ». Validez sur « Effacer les
                données de navigation ».
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LegalNoticeComponent;
