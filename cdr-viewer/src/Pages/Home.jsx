import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import './Home.css'
// import api from './Api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Home = () => {
    const [count, setCount] = useState(0)
    const [data, setData] = useState([  ])
    const [page, setPage] = useState(1)
    const [token, setToken] = useState('')
    const navigate = useNavigate()
    const [check, setCheck] = useState(true)

    const [dateD, setDateD] = useState(new Date().toISOString().substring(0, 10))
    const dateDHandling = (event) => {
        setDateD(event.currentTarget.value)
    }
    const api = axios.create({
        baseURL: 'http://localhost:5000/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const [dateF, setDateF] = useState(new Date().toISOString().substring(0, 10))
    const dateFHandling = (event) => {
        setDateF(event.currentTarget.value)
    }
    const [nSource, setNSource] = useState(6000)
    const nSourceHandling = (event) => {
        setNSource(event.currentTarget.value)
    }
    const [dSource, setDSource] = useState(6000)
    const dSourceHandling = (event) => {
        setDSource(event.currentTarget.value)
    }
    const [answered, setAnswered] = useState(false)
    const answeredHandling = (event) => {
        setAnswered(event.currentTarget.checked)
    }
    const [noanswer, setNoAnswer] = useState(false)
    const noanswerHandling = (event) => {
        setNoAnswer(event.currentTarget.checked)
    }
    const [busy, setBusy] = useState(false)
    const busyHandling = (event) => {
        setBusy(event.currentTarget.checked)
    }
    const handleChangePage = (event, value) => {
        setPage(value)
        getData('',value)
    }
    const [durationM, setDurationM] = useState(0)
    const durationMHandling = (event) => {
        setDurationM(event.currentTarget.value)
    }
    const [durationMx, setDurationMx] = useState(60)
    const durationMxHandling = (event) => {
        setDurationMx(event.currentTarget.value)
        event.currentTarget.focus()
    }
    const [checkSrc, setCheckSrc] = useState(false)
    const checkSrcHandling = (event) => {
        setCheckSrc(event.currentTarget.checked)
    }
    const [checkDst, setCheckDst] = useState(false)
    const checkDstHandling = (event) => {
        setCheckDst(event.currentTarget.checked)
    }
    const checkAuth = () => {
        if (localStorage.getItem('loginAdmin'))
        {
            const data = JSON.parse(localStorage.getItem('loginAdmin'))
            if (data['login'] === true)
            {
                setToken(data['token'])
            }
        }
    }

    const getData = (event ,pageT) => {
        if (!pageT) pageT = 1
        api.post('asterisk/check',{})
        .then(res => {
            if (res.status === 250)
            {
                localStorage.removeItem('loginAdmin')
                navigate("/")
            }
        })
        .catch(err => {
            console.log(err)
        })
        var source = 0
        var dest = 0
        if (checkSrc === true)
        {
            source = nSource
        }
        if (checkDst === true)
        {
            dest = dSource
        }
        api.post('asterisk', {
            dateD: dateD,
            dateF: dateF,
            nSource: source,
            dSource: dest,
            durationM: durationM,
            durationMx: durationMx,
            answered: answered,
            noanswer: noanswer,
            busy: busy,
            source: source,
            destination: dest,
            page: parseInt(pageT)
        })
        .then(res => {
            console.log(res)
            setCount(res.data.count)
            setData(res.data.records)
            console.log(res.data.records)
        })
        .catch(err => {
            console.log(err)
        })
    }
    const pageCount = (getNumber) => {
        const pageC = parseInt(getNumber / 10)
        const res = ((pageC * 10) < getNumber) ? (pageC + 1) : pageC
        console.log(res)
        return res
    }
    useEffect(() => {
        if (check === true)
        {
            checkAuth()
        }
    })
    const pageNbr = pageCount(count)

    const PaginationRounded = () => {
        if (pageNbr > 1)
        {
            return (
              <Stack spacing={2} style={{width: '100%', display: 'flex', alignItems: 'center'}} >
                    <Pagination page={page} count={pageNbr} shape="rounded" onChange={handleChangePage} />
              </Stack>
            );
        }
    }


    const recordList = (data.length !== 0) ? (
        data.map(record => {
            const dateN = new Date(record.calldate)
            const dateE = dateN.getDate()+"-"+((dateN.getMonth() < 10) ? "0"+dateN.getMonth() : dateN.getMonth())+"-"+dateN.getFullYear()+" "+dateN.getHours()+":"+ ((dateN.getMinutes() < 10) ? "0"+dateN.getMinutes() : dateN.getMinutes())
            return(
                <TableRow key={record.uniqueid+""+record.calldate}>
                    <TableCell component="th" scope="row">
                        {dateE}
                    </TableCell>
                    <TableCell align="right">{record.duration}</TableCell>
                    <TableCell align="right">{record.src}</TableCell>
                    <TableCell align="right">{record.channel}</TableCell>
                    <TableCell align="right">{record.dst}</TableCell>
                    <TableCell align="right">{record.dstchannel}</TableCell>
                    <TableCell align="right">{record.disposition}</TableCell>
                </TableRow>
            )
        })
    ) : (
        <TableRow>
            <TableCell component="th" scope="row">
                No data
            </TableCell>
            <TableCell align="right">No data</TableCell>
            <TableCell align="right">No data</TableCell>
            <TableCell align="right">No data</TableCell>
            <TableCell align="right">No data</TableCell>
        </TableRow>
    )
    // console.log(recordList)

    const Filter = () => {
        return (
            <>
            <Grid container rowSpacing={1} marginTop={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                    <Item>
                        <div className="row">
                            <div className="col">
                                <div className="ui card" style={{width: '100%', marginBottom: '15px', padding: '15px'}}>
                                    Filter
                                </div>
                            </div>
                        </div>
                        <div className="row" id='myCardFilter'>
                            <div className="col card">
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui label">
                                                Date and time range
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui left icon input" style={{width: '98%'}}>
                                                <input type="date" style={{textAlign: 'center'}} value={dateD} onChange={dateDHandling} max={dateF}/>
                                                <i aria-hidden="true" className="calendar icon"></i>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="ui left icon input" style={{width: '98%'}}>
                                                <input type="date" style={{textAlign: 'center'}} value={dateF} onChange={dateFHandling} min={dateD} />
                                                <i aria-hidden="true" className="calendar icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui label">Duration range</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui form" style={{display: 'flex'}}>
                                                <input type="number" value={durationM} max={durationMx} onChange={durationMHandling} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="ui form" style={{display: 'flex'}}>
                                                <input type="number" value={durationMx} min={durationM} onChange={durationMxHandling} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col card">
                                <div className="row">
                                    <div className="col"><i className="ui icon call"></i> Call State</div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <table className="ui table">
                                            <tr>
                                                <td>
                                                    <input type="checkbox" id="answered" checked={answered} onChange={answeredHandling}/>
                                                </td>
                                                <td>
                                                    <label htmlFor="answered">ANSWERED</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="checkbox" id="noanswer" checked={noanswer} onChange={noanswerHandling} />
                                                </td>
                                                <td>
                                                    <label htmlFor="noanswer">NO ANSWER</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input type="checkbox" id="busy" checked={busy} onChange={busyHandling} />
                                                </td>
                                                <td>
                                                    <label htmlFor="busy">BUSY</label>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col card">
                            <div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui label">
                                                Source Number
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui left icon input" style={{width: '98%'}}>
                                                <input type="number" value={nSource} onChange={nSourceHandling}/>
                                                <i aria-hidden="true" className="calendar icon"></i>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <input type="checkbox" checked={checkSrc} onChange={checkSrcHandling} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui label">Destination Number</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="ui left icon input" style={{width: '98%'}}>
                                                <input type="number" value={dSource} onChange={dSourceHandling} />
                                                <i aria-hidden="true" className="calendar icon"></i>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <input type="checkbox" checked={checkDst} onChange={checkDstHandling} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{marginTop: '15px', paddingLeft: '15px'}}>
                            <div className="col" style={{textAlign: 'left'}}>
                                <button className="ui button blue" onClick={getData}>Search</button>
                            </div>
                        </div>
                    </Item>
                </Grid>
            </Grid>
            </>
        )
    }

    return (
        <>
            <div className="container" style={{marginTop: '20px', maxWidth: '98%'}}>
                <Grid item xs={12}>
                    <Filter />
                </Grid>
                <Grid>
                <TableContainer component={Paper} style={{marginTop: '15px', marginBottom: '15px'}}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Call Date</TableCell>
                                <TableCell align="right">Duration</TableCell>
                                <TableCell align="right">Source Number</TableCell>
                                <TableCell align="right">Source Channel</TableCell>
                                <TableCell align="right">Destination Number</TableCell>
                                <TableCell align="right">Destination Channel</TableCell>
                                <TableCell align="right">Call Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recordList}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
                <PaginationRounded />
            </div>
        </>
    )
}

export default Home