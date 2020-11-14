import Link from 'next/link'
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

const About = ({title = "", data = '', ...rest}) => {
    return(<>
    <Section {...rest}>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container className="contentSection">
            <Columns className="aboutSection">
            <Columns.Column>
                {data}
            </Columns.Column>
            </Columns>
        </Container>
        <Container className="containLink">
            <Link href="/about">
                <a className="linkSee getOrange">En Savoir plus</a>
            </Link>
        </Container>
    </Section>
    </>)
}

export default About;