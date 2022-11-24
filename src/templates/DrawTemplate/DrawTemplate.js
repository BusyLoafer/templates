import React, {useEffect, useRef, useState} from "react";
import LetterSvg from "../../components/svg/LetterSvg";
import {DRAW_COLORS, DRAW_SETTINGS, DRAW_CURSOR, SOUNDS as S, RESET_TYPE, EX_CONTENT_TYPE} from "../../lib/const";
import {useDispatch, useSelector} from "react-redux";
import {setBtnAction, setLessonNext} from "../../store/actions";
import {resetStates, setFullWin} from "../../lib/yutuManager";
import {EventBus} from "../../lib/EventBus";
import SvgPath from "../../components/Animations/SvgPath";
import AnimatedPath from "../../components/Animations/AnimatedPath";
import {onLessonReset, lessonCompletion} from "../../components/MainComponent/Manager";
import {motion, useAnimation} from "framer-motion";

import "./style.scss"

const {borderColorMin, borderColorMax, drawColor, backgroundLetterColor, pointColor} = DRAW_COLORS;
const {step, minLength, basePadding, pointWidth, strokeDash, strokeLinecap} = DRAW_SETTINGS;
const {bigSize, bordersize, borderRadiusBig, smallSize, borderRadiusSmall} = DRAW_CURSOR;

const lessonType = EX_CONTENT_TYPE.draw;

let drawing = false;
let currentLineId = 0;
let lineLen = 0;

const DrawTemplate = (props) => {
	const {ex, exerciseDone} = props;

	const path = useAnimation();


	const startAnimCursor = () => {
		path.start({
			scale: 1.5,
		}).then(() => {
			path.start({
				scale: 1,
			})
		})
	}

	const resetCursor = (timer = 500) => {
		path.set({
			scale: 0,
		})
		setTimeout(() => {
			startAnimCursor();
		}, timer)
	}

	const dispatch = useDispatch();
	const coef = useSelector(state => state.baseCoef);
	const btnAction = useSelector(state => state.btnAction);
	const baseViewSize = useSelector(state => state.baseViewSize);

	const [svgSize, setSvgSize] = useState({x: 360, y: 360});

	const [correctedPaths, setCorrectedPaths] = useState([])
	const [currentPath, setCurrentPath] = useState([])

	const [letterBasePoints, setLetterBasePoints] = useState([])
	const [basePoints, setBasePoints] = useState([]);
	const [basePath, setBasePath] = useState([]);
	const [newPaths, setNewPaths] = useState([]);
	const [letterPath, setLetterPath] = useState([]);
	const [letterBasePath, setLetterBasePath] = useState([]);
	const [autoDrawing, setAutoDrawing] = useState(false);
	const [cursorPos, setCursorPos] = useState([0, 0]);
	const [showCursor, setShowCursor] = useState(false);
	const [done, setDone] = useState(false);
	const [autoPaths, setAutoPaths] = useState([]);
	const [drawPaths, setDrawPaths] = useState([]);
	const [progress, setProgress] = useState({value: 0});
	const [lineId, setLineId] = useState(0);
	const [lengths, setLengths] = useState([]);
	const [drawTime, setDrawTime] = useState([]);
	const [box, setBox] = useState({});
	const [line, setLine] = useState({
		color: drawColor,
		width: 40
	});

	const currentId = useSelector(state => state.currentId);

	const drawRef = useRef(null);

	useEffect(() => {
		if (ex) {
			const data = ex[lessonType];
			const paths = data.path.split(",")
			calculatePaths(paths)

			if (data.line) {
				setLine(data.line)
			}

			if (exerciseDone) {
				setDone(true);
				dispatch(setLessonNext(true))
			}
		}
	}, [ex])

	useEffect(() => {
		const box = {}
		box.x = drawRef.current.clientLeft;
		box.y = drawRef.current.clientTop
		box.x2 = drawRef.current.clientLeft + drawRef.current.clientWidth;
		box.y2 = drawRef.current.client + drawRef.current.clientHeight;
		box.w = drawRef.current.clientWidth;
		box.h = drawRef.current.clientHeight;
		setBox(box)
	}, [])


	useEffect(() => {
		if (basePath.length) {
			calculateBasePoints();
		}
	}, [basePath])

	useEffect(() => {
		if (ex.id === currentId) {
			switch (btnAction) {
				case RESET_TYPE:
					reset();
					break;
			}
			if (btnAction !== "") {
				dispatch(setBtnAction(""))
			}
		}
	}, [btnAction])


	useEffect(() => {
		setSvgSize({
			x: 360 * coef,
			y: 360 * coef
		})
	}, [coef])

	const calculatePaths = (paths) => {

		let arr = [];

		paths.forEach(p => {
			arr.push(p.split(/(?=[LMCHV])/))
		});

		const correctedPaths = [];

		let points = arr.map((a) => {

			const correctedPath = [];

			const pathPoints = a.map(d => {
				const name = d.slice(0, 1);
				const pairsObj = {};
				let pointsArray = d.slice(1).split(' ');

				pointsArray = pointsArray.map(pArr => {
					return (parseFloat(pArr) * coef).toString();
				})

				let correctedPoints = pointsArray.slice();
				correctedPoints[0] = name + correctedPoints[0];
				correctedPoints = correctedPoints.join(" ");
				correctedPath.push(correctedPoints);

				switch (name) {
					case "L":
						pairsObj.L = []
						for (var i = 0; i < pointsArray.length; i += 2) {
							pairsObj.L.push([+pointsArray[i], +pointsArray[i + 1]]);
						}
						break
					case "M":
						pairsObj.M = []
						for (var i = 0; i < pointsArray.length; i += 2) {
							pairsObj.M.push([+pointsArray[i], +pointsArray[i + 1]]);
						}
						break
					case "C":
						pairsObj.C = []
						for (var i = 0; i < pointsArray.length; i += 2) {
							pairsObj.C.push([+pointsArray[i], +pointsArray[i + 1]]);
						}
						break
					case "H":
						pairsObj.H = []
						for (var i = 0; i < pointsArray.length; i += 2) {
							pairsObj.H.push([+pointsArray[i], +pointsArray[i + 1]]);
						}
						break
					case "V":
						pairsObj.V = []
						for (var i = 0; i < pointsArray.length; i += 2) {
							pairsObj.V.push([+pointsArray[i]]);
						}
						break
				}

				return pairsObj;
			})

			correctedPaths.push(correctedPath.join());


			return pathPoints;

		});

		setCorrectedPaths(correctedPaths);

		setBasePath(points)
	}

	useEffect(() => {
		if (!done || !exerciseDone) {
			if (currentId === ex.id && letterBasePoints.length) {
				drawing = false;
				currentLineId = 0;
				lineLen = 0;
				const newCurrentPath = [];
				newCurrentPath.push(letterBasePoints[currentLineId].slice())
				setCurrentPath(newCurrentPath)
				setCursorPos(culculateCursorPos(letterBasePoints[currentLineId][0]))
				startAutoDrawing();
			} else {
				zeroing();
			}
		} else {
			setDrawPaths(drawPaths.slice());
		}
		currentLineId = 0;
		setShowCursor(false);
	}, [currentId, ex.id])

	useEffect(() => {
		setNewLetterPath()
		setNewLetterBasePath()
	}, [correctedPaths])

	useEffect(() => {
		if (letterBasePoints.length) {
			const newCurrentPath = currentPath.slice();
			newCurrentPath.push(letterBasePoints[currentLineId].slice())
			setCurrentPath(newCurrentPath)
		}
	}, [letterBasePoints])

	const setNewLetterPath = () => {
		setLetterPath(correctedPaths.map((path, index) => {
			return {
				d: path,
				stroke: pointColor,
				strokeWidth: pointWidth,
				strokeLinecap: strokeLinecap,
				strokeDasharray: strokeDash,
				show: index == 0
			}
		}))
	}

	const setNewLetterBasePath = (clean = false) => {
		setLetterBasePath(correctedPaths.map(path => {
			return {
				d: path,
				stroke: exerciseDone && !clean ? line.color : backgroundLetterColor,
				strokeWidth: line.width - 1,
				strokeLinecap: strokeLinecap,
				strokeDasharray: "",
				show: true
			}
		}))
	}

	const getPathPoints = (pathPoints) => {
		let points = []
		pathPoints.forEach(type => {
			if (type.M) {
				points.push([type.M[0][0], type.M[0][1]]);
			}
			if (type.L) {
				points = points.concat(getLinePoinst(points[points.length - 1], type.L[0]));
			}
			if (type.H) {
				const oldPoint = points[points.length - 1]
				points = points.concat(getLinePoinst(oldPoint, [type.H[0][0], oldPoint[1]]));
			}
			if (type.V) {
				const oldPoint = points[points.length - 1]
				points = points.concat(getLinePoinst(oldPoint, [oldPoint[0], type.V[0][0]]));
			}
			if (type.C) {
				points = points.concat(getCurvePoints(points[points.length - 1], type.C[0], type.C[1], type.C[2]));
			}
		})
		return points
	}

	const calculateBasePoints = () => {
		let arr = [];
		for (let i = 0; i < basePath.length; i++) {
			arr.push(getPathPoints(basePath[i]));
		}
		const lengths = [];
		const times = [];
		let fullLength = 0;
		setBasePoints(arr);
		setLetterBasePoints(arr);
		arr.forEach(path => {
			const len = getLineLength(path);
			fullLength += len
			lengths.push(len);
		})
		lengths.forEach(l => times.push(l / fullLength))
		setLengths(lengths);
		setDrawTime(times);
	}

	const getLineLength = points => {
		let total = 0;
		for (let i = 1; i < points.length; i++) {
			total += getLength(points[i], points[i - 1])
		}
		return total
	}

	const getLength = (p1, p2) => {
		return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2))
	}

	//  fP - first point, lP - last point
	const getLinePoinst = (fP, lP) => {
		const arr = [];
		const lenght = Math.sqrt(Math.pow(lP[0] - fP[0], 2) + Math.pow(lP[1] - fP[1], 2));
		const vector = [lP[0] - fP[0], lP[1] - fP[1]];
		const cStep = step * (lenght / (Math.ceil(lenght / step) * step))
		for (let i = 0; i <= lenght + 0.1; i += cStep) {
			const x = i / lenght;
			arr.push([fP[0] + vector[0] * x, fP[1] + vector[1] * x])
		}
		return arr;
	}

	//  fP - first point, fC - first curve point, lP - last point, lC - last curve point
	const getCurvePoints = (fP, fC, lP, lC) => {
		let x = 0.2;
		const tempX = getCurvePoint(fP[0], fC[0], lP[0], lC[0]);
		const tempY = getCurvePoint(fP[1], fC[1], lP[1], lC[1]);
		const lenght = Math.sqrt(Math.pow(tempX - fP[0], 2) + Math.pow(tempY - fP[1], 2));
		x = step * x / lenght;
		const arr = []
		for (let t = x; t < 1; t += x) {
			const tempX = getCurvePoint(fP[0], fC[0], lP[0], lC[0], t);
			const tempY = getCurvePoint(fP[1], fC[1], lP[1], lC[1], t);
			arr.push([tempX, tempY]);
		}
		return arr;
	}

	const getCurvePoint = (p1, p2, p3, p4, x = 0.2) => {
		return Math.pow(1 - x, 3) * p1 + 3 * Math.pow(1 - x, 2) * x * p2 + 3 * (1 - x) * Math.pow(x, 2) * p3 + Math.pow(x, 3) * p4;
	}

	const getCoord = (cX, cY) => {
		const dY = box.h * 0.5 - svgSize.y * 0.5
		const dW = box.w * 0.5 - svgSize.x * 0.5
		const coordinate = {
			x: cX - dW,
			y: cY - dY,
		}
		return coordinate;
	}

	const checkLengthDraw = (point1, point2) => {
		return Math.sqrt(Math.pow(point1.x - point2[0], 2) + Math.pow(point1.y - point2[1], 2)) < minLength;
	}

	const addPoint = (path, point) => {
		return path + "L" + point[0] + " " + point[1];
	}

	const endLine = () => {
		const arr = letterPath.slice();

		arr[currentLineId].stroke = line.color;
		arr[currentLineId].strokeWidth = line.width;
		arr[currentLineId].strokeLinecap = strokeLinecap;
		arr[currentLineId].strokeDasharray = "";

		currentLineId++;
		drawing = false;
		setLineId(lineId + 1)

		setProgress({value: 0});

		if (basePoints[currentLineId]) {
			const newCurrentPath = currentPath.slice();
			newCurrentPath.push(basePoints[currentLineId].slice())
			setCurrentPath(newCurrentPath)
			setCursorPos(culculateCursorPos(basePoints[currentLineId][0]))
			arr[currentLineId].show = true;
			resetCursor();
		} else {
			setTimeout(() => {
				setDone(true);
				setFullWin()
				dispatch(setLessonNext(true))
				lessonCompletion();
			}, 1000)
			setShowCursor(false);
			EventBus.$emit(S.play, {name: S.win})
			setTimeout(() => {
				finishDrawing();
			}, 500)
		}
		setLetterPath(arr)

	}

	const startDrawing = (e) => {
		const {nativeEvent} = e
		if (!autoDrawing && !done) {
			const {offsetX, offsetY} = nativeEvent;
			if (currentPath.length > currentLineId) {
				const coordinate = getCoord(offsetX, offsetY);
				if (coordinate.x >= 0) {
					const fP = currentPath[currentLineId][0];
					if (fP) {
						lineLen = 0;
						if (checkLengthDraw(coordinate, fP)) {
							drawing = true;
							const newPathD = "M" + fP[0] + " " + fP[1];
							const arr = newPaths.slice();
							arr.push(newPathD)
							setNewPaths(arr);

							const newDrawPaths = drawPaths.slice();
							newDrawPaths.push(correctedPaths[currentLineId]);
							setDrawPaths(newDrawPaths);

							setCursorPos(culculateCursorPos(currentPath[currentLineId][0]))
							const newCurrentPath = currentPath.slice();
							newCurrentPath[currentLineId].shift();
							setCurrentPath(newCurrentPath)
						}
					} else {
						endLine();
					}
				}
			}
		}
	}

	const draw = (event) => {
		if (drawing) {
			event.stopPropagation();
			const {nativeEvent} = event;
			const {pageX, pageY} = nativeEvent;
			// const { locationX, locationY } = nativeEvent;

			const {offsetX, offsetY} = nativeEvent;
			const coordinate = getCoord(offsetX, offsetY);
			if (coordinate.x >= 0) {
				let check = true;
				let curPos = culculateCursorPos(cursorPos, true);
				const arr = newPaths.slice();
				while (check) {
					const fP = currentPath[currentLineId][0];
					if (fP && checkLengthDraw(coordinate, fP)) {
						arr[currentLineId] = addPoint(arr[currentLineId], fP);

						lineLen += getLength(curPos, currentPath[currentLineId][0])
						curPos = currentPath[currentLineId][0];
						currentPath[currentLineId].shift();
						if (currentPath[currentLineId].length === 0) {
							check = false;
						}
					} else {
						check = false;
					}
				}
				if (curPos) {
					setNewPaths(arr);
					setCursorPos(culculateCursorPos(curPos));
					setProgress({value: lineLen / lengths[currentLineId]})
				}
				if (!currentPath[currentLineId][0]) {
					endLine()
				}
			}
		}
	}

	const finishDrawing = () => {
		lineLen = 0
		if (drawing) {
			currentPath[currentLineId] = basePoints[currentLineId].slice();
			setCursorPos(culculateCursorPos(currentPath[currentLineId][0]))
			const arr = newPaths.slice();
			arr.length = currentLineId;
			setNewPaths(arr);
			setProgress({value: 0});
			if (drawPaths.length === lineId + 1) {
				const newDrawPaths = drawPaths.slice();
				newDrawPaths.length = lineId;
				setDrawPaths(newDrawPaths)
			}
		}
		drawing = false;
	}

	const startAutoDrawing = () => {
		setAutoDrawing(true)
		setAutoPaths([correctedPaths[0]]);
	}

	const finishAutoLine = () => {
		if (autoPaths.length < correctedPaths.length) {
			setTimeout(() => {
				const arr = autoPaths.slice();
				arr.push(correctedPaths[arr.length])
				setAutoPaths(arr);
			}, 200)

		} else {
			currentLineId = 0;
			setLineId(0)

			setTimeout(() => {
				setAutoPaths([]);
				setAutoDrawing(false);
				setShowCursor(true);
				resetCursor(0);
			}, 10)
		}
	}

	const zeroing = () => {
		setNewLetterPath();
		setNewLetterBasePath(true);
		setNewPaths([]);
		setShowCursor(false);
		setDrawPaths([])
		setAutoPaths([]);
	}

	const reset = () => {
		onLessonReset();
		zeroing()
		setDone(false);
		dispatch(setLessonNext(false))
		setLineId(0);
		resetStates(["win", "confetti"])
		currentLineId = 0;
		const newCurrentPath = [];

		if (basePoints[currentLineId]) {
			newCurrentPath.push(basePoints[currentLineId].slice())
			setCursorPos(culculateCursorPos(basePoints[currentLineId][0]));
			startAutoDrawing();
		}
		setCurrentPath(newCurrentPath)
	}

	const culculateCursorPos = (point, revers = false) => {
		const delta = revers ? -1 : 1
		if (box.h && svgSize.y) {
			return [
				point[0] + (box.w - svgSize.x) * 0.5 * delta,
				point[1] + (box.h - svgSize.y) * 0.5 * delta
			]
		}
		return point
	}

	return (
		<div className="drawTemplate" style={baseViewSize}>

			<div className="lines abs" style={{height: svgSize.y}}>
				<div className="line" style={{marginBottom: 70 * coef}}/>
				<div className="line" style={{marginBottom: 70 * coef}}/>
				<div className="line" style={{marginBottom: 70 * coef}}/>
				<div className="line" style={{marginBottom: 70 * coef}}/>
				<div className="line" style={{marginBottom: 70 * coef}}/>
				<div className="line" style={{marginBottom: 70 * coef}}/>
			</div>

			{/* BACKGROUND LETTER */}
			<div className="abs">
				<LetterSvg
					size={svgSize}
					paths={letterBasePath}
				/>
			</div>

			{/* VISIBLE POINTS */}
			{
				showCursor &&
				<div className="abs">
					<LetterSvg
						line={line}
						size={svgSize}
						paths={letterPath}
					/>
				</div>
			}

			{/* AUTO DRAWING */}
			{
				autoPaths.map((path, index) => (
					<div className="abs" key={index}>
						<SvgPath path={path} onFinish={finishAutoLine} size={svgSize} line={line} time={drawTime[index]}/>
					</div>
				))
			}

			<div className="abs">
				<svg
					width={svgSize.x}
					height={svgSize.y}
					fill="none"
					viewBox={[
						0, 0, svgSize.x, svgSize.y
					].join(" ")}
				>
					{
						drawPaths.map((path, index) => (
							<AnimatedPath
								line={line}
								key={index}
								showMask={index === lineId - 1 && ex.id === currentId}
								d={path}
								progress={index !== lineId ? {value: 1} : progress}
							/>
						))
					}
				</svg>
			</div>

			{/* DRAW AREA */}
			<div
				className="drawArea"
				onMouseDown={startDrawing}
				onMouseUp={finishDrawing}
				onMouseMove={draw}
				ref={drawRef}
				style={{width: "100%", height: "100%", zIndex: 200}}
			>
				{/* {pointViews} */}

				{/* CURSOR */}
				{
					showCursor &&
					<motion.div
						animate={path}
						transition={{duration: 0.3}}
						className="abs circleWrapper"
						style={{
							top: cursorPos ? cursorPos[1] - bigSize * 0.5 + bordersize : 0,
							left: cursorPos ? cursorPos[0] - bigSize * 0.5 + bordersize : 0,
							scale: 0
						}}
					>
						<div className="circle"/>
					</motion.div>
				}


			</div>

		</div>
	);
}

export default DrawTemplate;