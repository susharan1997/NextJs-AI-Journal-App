import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import styled from "styled-components";
import JournalContentSpinner from './JournalContentSpinner';
import { EntryAnalysisType } from "@/types";
import { useFormattedColors } from "@/utils/useFormattedColors";
import { useRouter } from 'next/navigation';

interface HistoryChartProps {
    data: EntryAnalysisType[] | null
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    payload?: { payload: EntryAnalysisType }[];
    label?: string;
    active?: boolean;
}

const TooltipContainer = styled.div`
  padding: 2rem;
  width: 150px;
  height: 125px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  position: relative;
`;

const ColorIndicator = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'color',
}) <{ color: string }>`
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: ${props => props.color};
`;

const DateLabel = styled.p`
  width: 140px;
  margin-top: 10px;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
`;

const MoodText = styled.p`
  width: 140px;
  text-align: center;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
`;

const ScoreText = styled.p`
    width: 140px;
    text-align: center;
    font-size: 1rem;
    white-space: nowrap;
    font-weight: bold;
`;

const SpinnerContainer = styled(JournalContentSpinner)`
    position: absolute;
    top: 50%;
    left: 55%;
`;

const LineChartContainer = styled(LineChart)`
    align-self: center;
    padding: 10px;
    border: 2px solid #006994;
    border-radius: 1em;
    font-family: 'Merriweather', Georgia, serif;
`;

const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload, label, active }) => {
    const dateLabel = new Date(label!).toLocaleString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    const moodColor = useFormattedColors(payload![0]?.payload?.color);

    if (active && payload && payload.length > 0) {
        const analysis = payload[0].payload;
        return (
            <TooltipContainer>
                <ColorIndicator color={moodColor}>
                    <DateLabel>
                        {dateLabel}
                    </DateLabel>
                    <ScoreText>
                        Score: {analysis.sentimentScore}
                    </ScoreText>
                    <MoodText>
                        {analysis.mood}
                    </MoodText>
                </ColorIndicator>
            </TooltipContainer>
        )
    }
    return null;
}

const CustomDot: React.FC<any> = (props) => {
    const { cx, cy, payload} = props;
    const router = useRouter();

    const handleClick = () => {
        router.push(`/journal/${payload.entryId}`);
    }

    return(
        <circle
            cx={cx}
            cy={cy}
            r={8}
            stroke="blue"
            strokeWidth={2}
            fill="white"
            onClick={handleClick}
            style={{cursor: 'pointer'}}
        />
    )
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
    return (
        <>
            {data ?
                (
                    <LineChartContainer width={900} height={400} data={data}>
                        <Line
                            type='monotone'
                            dataKey='sentimentScore'
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={<CustomDot />}
                        />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis
                            dataKey='updatedAt'
                            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                            label={{
                                value: "Date",
                                position: "insideBottom",
                                offset: -5,
                                style: {
                                    textAnchor: "middle",
                                    fill: "#555",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                },
                            }}
                        />
                        <YAxis
                            label={{
                                value: 'Sentiment score',
                                position: "outsideLeft",
                                angle: -90,
                                style: {
                                    textAnchor: "middle",
                                    fill: "#555",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                },
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </LineChartContainer>
                )
                :
                <SpinnerContainer>
                    <JournalContentSpinner />
                </SpinnerContainer>

            }
        </>
    )
}

export default HistoryChart;

