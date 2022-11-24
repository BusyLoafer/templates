import React from 'react'
const baseSize = { x: 336, y: 172 };

export default (props) => {

	const {
		size = baseSize,
		fill = "white"
	} = props;

	return (
		<svg width={size.x} height={size.y} viewBox="0 0 336 172" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_d_1096_8657)">
				<rect x="4" width="328" height="164" rx="32" fill="#7480FF" shapeRendering="crispEdges"/>
				<path d="M27.9126 18C32.5314 10 44.0784 10 48.6972 18L56.7554 31.9573C61.3742 39.9573 55.6007 49.9573 46.3631 49.9573L30.2466 49.9573C21.009 49.9573 15.2355 39.9573 19.8543 31.9573L27.9126 18Z" fill="url(#paint0_linear_1096_8657)"/>
				<path d="M54.8871 153.33C51.8085 153.386 49.8238 150.088 51.3148 147.394L65.6853 121.427C67.1763 118.733 71.0247 118.663 72.6124 121.301L87.9152 146.73C89.5029 149.369 87.6392 152.736 84.5605 152.792L54.8871 153.33Z" fill="url(#paint1_linear_1096_8657)"/>
				<path d="M269.843 18.2183C270.721 8.58387 281.699 3.51244 289.604 9.08977C297.508 14.6671 296.411 26.7102 287.629 30.7673C278.846 34.8245 268.965 27.8528 269.843 18.2183Z" fill="url(#paint2_linear_1096_8657)"/>
				<circle cx="302" cy="120" r="20" fill="url(#paint3_linear_1096_8657)"/>
				<path opacity="0.2" d="M330.331 75.6466C328.7 75.244 174.716 46.0906 214.788 88.6293C254.86 131.168 316.764 133.645 290.838 84.3927C264.913 35.1404 177.19 -0.871915 158.911 48.4723C140.632 97.8165 163.557 150.605 179.111 111.206C194.666 71.8069 167.75 13.6686 126.9 28.2145C86.0507 42.7605 15.0381 69.5053 6.45813 73.6995C-2.12187 77.8936 40.5422 159.709 70.8785 104.285C101.215 48.8623 114.995 22.2975 43.1835 34.1574" stroke="url(#paint4_linear_1096_8657)" stroke-width="2" stroke-linecap="round"/>
				<rect x="5" y="1" width="326" height="162" rx="31" stroke="#8F98FF" strokeWidth="2" shapeRendering="crispEdges"/>
			</g>
			<defs>
				<filter id="filter0_d_1096_8657" x="0" y="0" width="336" height="172" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix"/>
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
					<feOffset dy="4"/>
					<feGaussianBlur stdDeviation="2"/>
					<feComposite in2="hardAlpha" operator="out"/>
					<feColorMatrix type="matrix" values="0 0 0 0 0.454902 0 0 0 0 0.501961 0 0 0 0 1 0 0 0 0.12 0"/>
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1096_8657"/>
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1096_8657" result="shape"/>
				</filter>
				<linearGradient id="paint0_linear_1096_8657" x1="36.2451" y1="-9.45029" x2="35.6178" y2="70.0988" gradientUnits="userSpaceOnUse">
					<stop stopColor="#616FFF"/>
					<stop offset="1" stopColor="#7A86FF"/>
				</linearGradient>
				<linearGradient id="paint1_linear_1096_8657" x1="42.6508" y1="158.465" x2="94.3335" y2="127.916" gradientUnits="userSpaceOnUse">
					<stop stopColor="#616FFF"/>
					<stop offset="1" stopColor="#7A86FF"/>
				</linearGradient>
				<linearGradient id="paint2_linear_1096_8657" x1="267.416" y1="-9.28185" x2="292.163" y2="45.417" gradientUnits="userSpaceOnUse">
					<stop stopColor="#616FFF"/>
					<stop offset="1" stopColor="#7A86FF"/>
				</linearGradient>
				<linearGradient id="paint3_linear_1096_8657" x1="300.763" y1="94.325" x2="300.386" y2="142.095" gradientUnits="userSpaceOnUse">
					<stop stopColor="#616FFF"/>
					<stop offset="1" stopColor="#7A86FF"/>
				</linearGradient>
				<linearGradient id="paint4_linear_1096_8657" x1="306.068" y1="100.214" x2="-3.47253" y2="38.9821" gradientUnits="userSpaceOnUse">
					<stop stopColor="#3D4EFF"/>
					<stop offset="1" stopColor="#DBDEFF"/>
				</linearGradient>
			</defs>
		</svg>
	)
}