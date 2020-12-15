import Link from 'next/link'
import moment from 'moment'
import arrowRight from './../../public/images/right-arrow.svg'
import { motion } from 'framer-motion';
import {
    Container,
    Columns,
    Section,
    Heading,
    Image,
    Box,
    Loader,
    Tag,
    Content
} from 'react-bulma-components';

let easing = [0.175, 0.85, 0.42, 0.96];

const imageVariants = {
  exit: { y: 150, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing
    }
  }
};

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
  }
};

const backVariants = {
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: easing
    }
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: easing
    }
  }
};
const Sections = ({title = "", data = [], ...rest}) => {
    return(<motion.div className="motionWrapper" initial="exit" animate="enter" exit="exit">
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container>
            <Columns className="homeCategory">
            {data.map((post, i) => (
                <Columns.Column key={i} size="half">
                    <motion.div variants={backVariants}>
                    <Link
                        href={'/projet/[slug]'}
                        as={`/projet/${encodeURIComponent(post.title)}`}
                      >
                      <a>
                        <Image rounded={false} src={post.imageMainPrincipal} />
                      </a>
                      </Link>

                    </motion.div>
                    <Tag.Group className="tagGroupPost">
                        <Tag className="recentDate">
                            {moment(post.date).locale('fr').format('LL', 'fr')}
                        </Tag>
                        {post.listCategory.map((tag, i) => (
                            <Tag key={i}>{tag}</Tag>
                        ))}
                    </Tag.Group>
                    <Heading subtitle className="subTitleProjects">
                       {post.title}
                    </Heading>
                    <Content className="contentText" dangerouslySetInnerHTML={{__html:post.subTextDescription.substring(1, 60)}}>
                    </Content>
                        {/* <Link
                            href={'/project/[id]'}
                            as={`/project/${post._id}`}>
                            <a className="linkSee">Voir le projet <span className="icoRight" width={26}></span></a>
                        </Link> */}
                        <Link
                            href={'/projet/[slug]'}
                            as={`/projet/${encodeURIComponent(post.title)}`}
                        >
                            <a className="linkSee">Voir le projet <span className="icoRight" width={26}></span></a>
                        </Link>
                </Columns.Column>
                ))}
            </Columns>
            <Container className="containLink">
                <Link
                    href={'/projets/[slug]'}
                    as={`/projets/recents`}>
                    <a className="linkSee getOrange">Voir tous les projets <span className="icoRight orangeSvg" width={26}></span></a>
                </Link>
            </Container>
        </Container>
    </Section>
    </motion.div>)
}

export default Sections;