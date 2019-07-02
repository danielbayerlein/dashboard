import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import { Li, Wrapper, Circle, Text } from '../../monitor-list'

export default class UptimeRobotSites extends Component {
    static defaultProps = {
        interval: 1000 * 60,
        title: 'UptimeRobot',
        url:'https://api.uptimerobot.com/v2/getMonitors'
    }

    state = {
        loading: true,
        error: false,
        monitors: []
    }

    componentDidMount() {
        this.fetchInformation();
    }

    componentWillUnmount () {
        clearInterval(this.timeout)
    }

    async fetchInformation() {
        const { url, apiKey } = this.props;
        try {
            let data = await fetch(url, {
                method: 'post', headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ api_key: apiKey, statuses: "9" })
            });
            let formated = await data.json();
            if (formated.stat === 'ok') {
                this.setState({ monitors: formated.monitors, loading: false });
            } else {
                throw "err";
            }
        }
        catch (err) {
            this.setState({ error: true, loading: false });
        }finally {
            this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
        }
    }

    render() {
        const { error, loading, monitors } = this.state
        const { title } = this.props
        return (
            <Widget title={title} loading={loading} error={error}>
                {
                    monitors.map((monitor) => {
                        return <Li key={monitor.id}>
                            <Wrapper>
                                <Text>{monitor.friendly_name}</Text>
                                <Circle />
                            </Wrapper>
                        </Li>
                    })
                }
            </Widget>
        )
    }
}
