import classes from "./HomeComponent.module.css";
import Image from "next/image";
import bgPicture from "../../public/home/bg-picture.jpg";

function HomeComponent() {
  return (
    <main>
      <div className={classes.contentwrap}>
        <article className={classes.singlepagearticle}>
          <section className={classes.bgpicture}>
            <div className={classes.bgcolumn}>
              {/* <Image
                src={bgPicture}
                alt="home page background picture"
                width={1300}
                height={800}
                objectFit="cover"
              /> */}
              <div className={classes.bgtextctr}>
                <div className={classes.bgtextheading}>
                  <h2>Lorem ipsum dolor sit.</h2>
                </div>
                <div className={classes.bgtextdivider}>
                  <div className={classes.divider}>
                    <div> </div>
                  </div>
                </div>
                <div className={classes.bgtextcontent}>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    <br />
                    Perferendis maxime autem nam cumque quo expedita!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

export default HomeComponent;
