/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Nav, Row, Spinner, Tab, Tabs } from 'react-bootstrap'
import { api } from '../services/api'

import Swal from 'sweetalert2'

import { Container, ModalConfirmation } from '../styles/home'

interface InvitationData {
  data: {
    ref: {
      id: string
    };
    ts: string;
    id: string;
    data: {
      invitation_code: string;
      confirmed_invitation: boolean;
      guests: {
        nome: string;
        confirmed: boolean;
      }[]
    }
  }
}

const Home: NextPage = () => {
  const [key, setKey] = useState<string>('geral');
  const [show, setShow] = useState<boolean>(false);
  const [invitationData, setInvitationData] = useState<InvitationData | undefined>();
  const [loadingGetInvitation, setLoadingGetInvitation] = useState<boolean>(false)
  const [loadingConfirmation, setLoadingConfirmation] = useState<boolean>(false)

  const [confirmationCode, setConfirmationCode] = useState<string>('');

  const handleConfirmation = useCallback(async () => {
    if (confirmationCode && confirmationCode !== undefined) {
      setLoadingGetInvitation(true)
      try {
        const response = await api.post('/getInvitationData', {
          confirmationCode,
        })
        if (response.data.type === 'found') {
          const orderedGuests: InvitationData = response.data;
          if (orderedGuests.data.data.confirmed_invitation) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Convite já confirmado!',
              text: "Obrigado por fazer parte desse tão momento especial!",
              timer: 3000,
            })
            setLoadingGetInvitation(false)
            return;
          }
          orderedGuests.data.data.guests.sort(function (a, b) {
            if (a.nome < b.nome) {
              return -1;
            }
            if (a.nome > b.nome) {
              return 1;
            }
            return 0;
          });
          setInvitationData(orderedGuests)
          setShow(true);
        } else if (response.data.type === 'notFound') {
          Swal.fire({
            position: 'center',
            icon: 'question',
            title: 'Oops...',
            text: "Não encontramos seu código de confirmação... Por favor tente novamente ou entre em contato conosco (Marco ou Júlia) para confirmar sua presença.",
          })
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Oops...',
            text: "Houve um erro na confirmação! Por favor tente novamente ou entre em contato conosco (Marco ou Júlia) para confirmar sua presença.",
          })
        }
        setLoadingGetInvitation(false)
      } catch (error) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops...',
          text: `Houve um erro na confirmação! Por favor tente novamente ou entre em contato conosco (Marco ou Júlia) para confirmar sua presença. - [${error}]`,
        })
        setLoadingGetInvitation(false)
      }
    }
  }, [confirmationCode]);

  const handleChangeStatus = useCallback((nome: string) => {
    if (invitationData) {
      const guestToChange = invitationData.data.data.guests.filter((guest) => guest.nome === nome);
      const rest = invitationData.data.data.guests.filter((guest) => guest.nome !== nome);
      if (guestToChange) {
        guestToChange[0].confirmed = !guestToChange[0].confirmed;
      }
      const joinedGuests = [...rest, guestToChange[0]];
      joinedGuests.sort(function (a, b) {
        if (a.nome < b.nome) {
          return -1;
        }
        if (a.nome > b.nome) {
          return 1;
        }
        return 0;
      });
      setInvitationData({
        ...invitationData,
        data: {
          ...invitationData.data,
          data: {
            ...invitationData.data.data,
            guests: joinedGuests,
          }
        }
      })
    }
  }, [invitationData]);

  const handleSaveConfirmation = useCallback(async () => {
    setLoadingConfirmation(true)
    try {
      if (invitationData) {
        const response = await api.post('/setInvitationData', {
          confirmationCode,
          invitationData: invitationData.data,
        })

        if (response.data.type === 'alreadyConfirmed') {
          setShow(false)
          setConfirmationCode('');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Presença já confirmada!',
            text: "Obrigado por fazer parte desse tão momento especial!",
            timer: 5000
          })
        } else if (response.data.type === 'confirmed') {
          setShow(false)
          setConfirmationCode('');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Presença confirmada!',
            text: "Obrigado por fazer parte desse tão momento especial. Sua presença é muito importante para nós!",
            timer: 5000
          })
        }
      }
      setLoadingConfirmation(false)
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops...',
        text: `Houve um erro na confirmação! Por favor tente novamente ou entre em contato conosco (Marco ou Júlia) para confirmar sua presença. - [${error}]`,
        timer: 5000
      })
      setLoadingConfirmation(false)
    }
  }, [confirmationCode, invitationData]);

  return (
    <>
      <Head>
        <title>💘 Casamento Júlia e Marco 💘</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <header className="container-fluid">
          <img
            src="/images/nozes2.jpg"
            alt="Marco a Júlia"
          />
          <div className="tab-menu">
            <div className="menu">
              <a onClick={() => setKey('geral')} className={`tab-menu-hover ${key === 'geral' && 'classActivated'}`}>CONFIRMAÇÃO DE PRESENÇA </a>
              <a onClick={() => setKey('endereco')} className={`tab-menu-hover ${key === 'endereco' && 'classActivated'}`}>ENDEREÇO</a>
              <a onClick={() => setKey('lista')} className={`tab-menu-hover ${key === 'lista' && 'classActivated'}`}>PRESENTEIE OS NOIVOS</a>
            </div>
            <div className="tab-bottom" />
          </div>
        </header>

        <div className="container">

          <Tabs
            id="controlled-tab-cliente"
            activeKey={key}
            onSelect={(k) => setKey(`${k}`)}
          >
            <Tab eventKey="geral" title="">
              <section>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h1>CASAMENTO JÚLIA E MARCO</h1>
                    </div>
                    <div className="col-12">
                      <h3>2 de Julho de 2022</h3>
                    </div>
                    <div className="col-12">
                      <p>Para confirmar sua presença informe abaixo o código recebido em seu convite</p>
                    </div>
                    <div className="col-12">
                      <form>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Código de confirmação"
                          placeholder='Código de confirmação'
                          onChange={(e) => setConfirmationCode(e.target.value)}
                          value={confirmationCode}
                        />
                        <button type="button" className="btn btn-primary" onClick={handleConfirmation}>
                          {loadingGetInvitation ? (<Spinner animation="border" variant="light" />) : 'CONFIRMAR'}
                        </button>
                      </form>
                    </div>
                    {/* <div className="col-12"> */}
                    {/* <div className="row">
                    <form>
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control"
                            aria-label="Código de confirmação"
                            placeholder='Código de confirmação'
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            value={confirmationCode}
                          />
                        </div>
                        <div className="form-group">
                          <button type="button" className="btn btn-primary" onClick={handleConfirmation}>
                            {loadingGetInvitation ? (<Spinner animation="border" variant="light" />) : 'CONFIRMAR'}
                          </button>
                        </div>
                      </form>
                    </div> */}

                    {/* </div> */}
                  </div>
                </div>
              </section>
            </Tab>
            <Tab eventKey="endereco" title="">
              <section>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h1>CASAMENTO JÚLIA E MARCO</h1>
                    </div>
                    <div className="col-12">
                      <h3>2 de Julho de 2022</h3>
                    </div>
                    <div className="col-12">
                      <p>Gramado, Redenção da Serra - SP (Via Rodovía Otácilio F. da Silva)</p>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                      <small>Clique no mapa para ver a localização completa</small>
                    </div>
                    <div className="col-12 map">
                      <a target="_blank" href="https://www.google.com.br/maps/place/Chácara+Família+Lima/@-23.2959127,-45.5030806,17z/data=!4m12!1m6!3m5!1s0x94cd0f7a5d47489b:0xf68b2b6cdcb644d7!2sChácara+Família+Lima!8m2!3d-23.2959127!4d-45.5008919!3m4!1s0x94cd0f7a5d47489b:0xf68b2b6cdcb644d7!8m2!3d-23.2959127!4d-45.5008919" rel="noreferrer">
                        <img src="/images/redencao.jpg" className="img-responsive" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </Tab>
            <Tab eventKey="lista" title="">
              <section>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h1>CASAMENTO JÚLIA E MARCO</h1>
                    </div>
                    <div className="col-12">
                      <h3>2 de Julho de 2022</h3>
                    </div>
                    <div className="col-12">
                      <p>Para presentear os noivos, acesse a lista de presentes no site do ponto frio.</p>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                      <small>Caso queria presentear e encontre o item em outra loja basta informar para que o retiremos da lista. Obrigado! 💘</small>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                      <div className="lista">
                        <a href="https://listas.pontofrio.com.br/maicoejula" target="_blank" className="lista" rel="noreferrer">
                          <img src="/images/MeuConviteDigital .png" alt="lista-de-casamento" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Tab>
          </Tabs>
        </div>
      </Container>

      <ModalConfirmation
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '50px' }}>
          <div style={{ marginBottom: '20px' }}>
            <small>Por favor, selecione abaixo quem comparecerá ao casamento.</small>
          </div>
          <Form className="form-data">
            {invitationData && invitationData.data.data.guests.map((guest) => {
              return (
                <Form.Check
                  key={guest.nome}
                  type="switch"
                  id="custom-switch"
                  label={guest.nome}
                  checked={guest.confirmed}
                  onChange={() => handleChangeStatus(guest.nome)}
                />
              )
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleSaveConfirmation()}>
            {loadingConfirmation ? (<Spinner animation="border" variant="light" />) : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </ModalConfirmation>
    </>
  )
}

export default Home
