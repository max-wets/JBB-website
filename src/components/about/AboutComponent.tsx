import classes from "./AboutComponent.module.css";
import Image from "next/image";
import aboutPic from "../../../public/julieb-pic.jpg";

function AboutComponent() {
  return (
    <article className={classes.wrap}>
      <section className={classes.sectionctr}>
        <div className={classes.sectionwrap}>
          <div className={classes.row}>
            <div className={classes.col50}>
              <div className={classes.colwrap}>
                <Image
                  src={aboutPic}
                  alt="Picture of Julie Baronnie"
                  width={700}
                  height={800}
                />
              </div>
            </div>
            <div className={classes.col50}>
              <div className={classes.colwrap}>
                <div className={classes.heading}>
                  <h2>Qui suis-je ?</h2>
                </div>
                <div className={classes.dividerwrap}>
                  <div className={classes.dividerctr}>
                    <div className={classes.divider}>
                      <div className={classes.separator}></div>
                    </div>
                  </div>
                </div>
                <div className={classes.textctr}>
                  <p>
                    Comédienne, cinéma, tv ou théâtre, animatrice tv, on peut
                    dire que j'ai eu plusieurs vies en une seule, artiste dans
                    l'âme, tout ce qui touche au domaine de la beauté me
                    passionne, que ce soit la médecine esthétique, le make up,
                    la mode, la décoration, j'aime créer, embellir, améliorer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={classes.textblock}>
        <div className={classes.textcol}>
          <div className={classes.textrow}>
            <p>
              Je partage ici via les vidéos de ma chaîne Odysee, mes techniques
              anti âge que je pratique depuis longtemps sur moi-même,
              injections, mésotherapie, microneedling, fils tenseurs, botox.
              J’utilise uniquement des produits professionnels que j’achète chez
              Acecosm en Corée, qui est le best, service client incroyable,
              toujours aux petits soins pour leurs clients, une livraison
              express en 3 / 4 jours, site sécurisé avec des produits que les
              médecins utilisent, validés CE ou FDA.
            </p>
            <p>
              Tous les liens des produits que j’utilise sont reliés directement
              sur leur site web, vous avez une remise permanente de 10% sur tous
              les produits avec mon code : julie
            </p>
            <p>
              De temps en temps il y a des offres ponctuelles pendant 3 jours.
            </p>
            <p>
              Pensez à suivre mes actualités et à vous abonner à ma{" "}
              <a
                href="https://odysee.com/@JulieBaronnieBeauty:7"
                target="_blank"
              >
                chaîne Odysee
              </a>{" "}
              afin d’être avertis.
            </p>
            <p>
              Je ne recommande que ce vendeur car il est hors de question que je
              propose des sites non fiables.
            </p>
            <p>
              Tout comme je déconseille fortement d’acheter des produits
              d’injections sur le fameux site « foirfouille » en chine, ou
              pullulent contrefaçons, produits souillés et j’en passe...
            </p>
            <p>
              Je reçois énormément de mails de personnes qui se retrouvent avec
              des infections, voire septicémies. Et si vous avez la chance de
              passer à travers une infection, ces produits sont de la poudre de
              perlimpinpin par conséquent cela ne fera strictement rien sur
              votre peau à part un effet placebo.
            </p>
            <p>
              Les coréens sont précurseurs en la matière, leurs produits de
              médecine esthétique sont excellents.
            </p>
            <p>
              Auparavant j’avais testé tous les produits européens, chers et pas
              du tout satisfaite du résultat, c’est pourquoi je me suis tournée
              vers la Corée et mes résultats sont éloquents.
            </p>
            <p>
              Je partage ce que je fais et en aucun cas je ne vous incite à
              faire de même.
            </p>
            <p>
              Attention : n'allez jamais vous faire injecter chez des personnes
              qui se disent professionnelles des injections se vantant de
              diplômes qui n'existent pas ! C'est interdit par la loi !
            </p>
            <p>
              Seuls les médecins sont habilités à injecter sur autrui. Il y a
              bien trop de ratés et d'accidents.
            </p>
            <p>Ma peau est comme une toile que j'améliore jour après jour.</p>
          </div>
          <div className={classes.textsignaturectr}>
            <div className={classes.signature}>Julie Baronnie</div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default AboutComponent;
