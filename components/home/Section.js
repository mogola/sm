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

const Sections = ({title = "", list = []}) => {
    return(<>
    <Section>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container>
            <Columns className="homeCategory">
                <Columns.Column size="half">
                    <Image rounded={false} src="http://bulma.io/images/placeholders/640x384.png" size="3by2" />
                    <Tag.Group className="tagGroupPost">
                        <Tag className="recentDate">
                            Septembre 2019
                        </Tag>
                        <Tag>
                            Illustration
                        </Tag>
                        <Tag>
                            Digital painting
                        </Tag>
                    </Tag.Group>
                    <Heading subTitle className="subTitleProjects">
                        Nom du projet
                    </Heading>
                    <Content className="contentText">
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac nulla consequat, euismod ipsum dictum, condimentum lectus. Sed rutrum lani…
                        </p>
                    </Content>
                    <Link href="/">
                        <a className="linkToProject">
                            Voir le Projet
                        </a>
                    </Link>
                </Columns.Column>
            </Columns>
        </Container>
    </Section>
    </>)
}

export default Sections;