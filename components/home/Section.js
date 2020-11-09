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

const Sections = ({title = "", data = []}) => {
    return(<>
    <Section>
        <Container className="containerTitleSection">
        <Heading className="titleMainCategory" size={1}>
          {title}
        </Heading>
        </Container>
        <Container>
            <Columns className="homeCategory">
            {data.map((post, i) => (
                <Columns.Column key={i} size="half">
                    <Image rounded={false} src={post.imageMainPrincipal} size="3by2" />
                    <Tag.Group className="tagGroupPost">
                        <Tag className="recentDate">
                            {post.date}
                        </Tag>
                        <Tag>
                            {post.listCategory}
                        </Tag>
                    </Tag.Group>
                    <Heading subtitle className="subTitleProjects">
                       {post.title}
                    </Heading>
                    <Content className="contentText">
                        <p>
                        {post.subTextDescription}
                        </p>
                    </Content>
                        <Link href={'/project/[id]'} as={`/project/${post._id}`}>
                            <a>Voir le projet</a>
                        </Link>
                </Columns.Column>
                ))}
            </Columns>
        </Container>
    </Section>
    </>)
}

export default Sections;