import { Fragment, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import global from "../../global";
import { Form, Button, Container, Card, Row, Col, Image } from "react-bootstrap";

export function Home(){
    const [username, setUsername] = useState();
    const [infoGitHub, setInfoGitHub] = useState();
    const [repos, setRepos] = useState([]);
    const [reposFinally, setReposFinally] = useState([]);

    const getRepository = async (e) => {
        await axios.get(`${global.url}/users/${username}`)
        .then(async (responseUserInfo) => {
            setInfoGitHub(responseUserInfo.data);

            await axios.get(`${global.url}/users/${username}/repos?per_page=100`)
            .then(async (responseUserRepos) => {
                let pagesTotal = Math.round(responseUserInfo.data.public_repos / responseUserRepos.data.length);

                for (let index = 1; index <= pagesTotal; index++) {
                    await axios.get(`${global.url}/users/${username}/repos?page=${index}`)
                    .then(async (responseUserRepos) => {
                        responseUserRepos.data.forEach(element => {
                            repos.push(
                                {
                                    html_url: element?.html_url,
                                    name: element?.name,
                                    stargazers_count: element?.stargazers_count,
                                    language: element?.language
                                }
                            );
                        });
                    });
                }
            });

            let orderObject = repos.sort(function(a, b){
                return a.stargazers_count - b.stargazers_count;
            });
            let inverseObect = orderObject.reverse();

            for (let index = 0; index < 10; index++) {
                reposFinally.push(inverseObect[index]);
            }
        })
        .catch(() => {
            Swal.fire({
                title: 'Ocurrio un error inesperado',
                text: `el repositorio ${username} no existe, valide nuevamente.`,
                icon: 'error'
            });
        });
    }

    return(
        <Fragment>
            <Card className="bg-dark text-white p-2">
                <Card.Header className="text-center mt-2">
                    Buscar Top 10 de un repositorio de GitHub por su nombre de usuario
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={(e) => {e.preventDefault(); getRepository();}}>
                        <Form.Group className="text-center mb-3">
                            <Form.Label>Nombre de usuario del repositorio</Form.Label>
                            <Form.Control 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" 
                                placeholder="Nombre de usuario del repositorio" 
                                required 
                            />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button 
                                className="mt-3" 
                                variant="outline-secondary" 
                                size="lg"
                                type="submit"
                            >
                                Buscar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Container>
                        <Row>
                            <Col xs md lg={1}>
                                <Image src={infoGitHub?.avatar_url} style={{height: '60%', width: '60%'}} roundedCircle />
                            </Col>
                            <Col xs md lg={3}>
                                {infoGitHub?.name}
                            </Col>
                            <Col  xs md lg={6} className="text-center">
                                BIO: {infoGitHub?.bio}
                            </Col>
                            <Col  xs md lg={2} className="text-center">
                                Repositorios: {infoGitHub?.public_repos}
                            </Col>
                        </Row>
                        <Row>
                            <Col>Link Repositorio</Col>
                            <Col>Cantidad Estrellas <i className="bi bi-star"></i></Col>
                            <Col>Lenguaje</Col>
                        </Row>
                        {reposFinally?.length > 0 && repos.map((reposFinally) => (
                            <Row>
                                <Col>
                                    <a href={reposFinally.html_url} target="_blank" rel="noopener noreferrer">
                                        {reposFinally.name}
                                    </a>
                                </Col>
                                <Col>
                                    <strong>{reposFinally.stargazers_count}</strong>
                                </Col>
                                <Col>
                                    <strong>{reposFinally.language}</strong>
                                </Col>
                            </Row>
                        ))}
                    </Container>
                </Card.Footer>
            </Card>
        </Fragment>
    );
}