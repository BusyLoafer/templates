// import confettiData from "/assets/lottie/confetti.json";
import confettiData from "../lottie/confetti.json";

import giraffeDone1 from "../lottie/giraffe/done_1.json";
import giraffeDone2 from "../lottie/giraffe/done_2.json";
import giraffeDid from "../lottie/giraffe/you_did_it.json";
import giraffeError from "../lottie/giraffe/error.json";
import giraffeLose1 from "../lottie/giraffe/lose_1.json";
import giraffeLose2 from "../lottie/giraffe/lose_2.json";
import giraffeWaiting from "../lottie/giraffe/waiting.json";

import yutuDone1 from "../lottie/yutu/done_1.json";
import yutuDone2 from "../lottie/yutu/done_2.json";
import yutuDid from "../lottie/yutu/you_did_it.json";
import yutuError from "../lottie/yutu/error.json";
import yutuLose1 from "../lottie/yutu/lose_1.json";
import yutuLose2 from "../lottie/yutu/lose_2.json";
import yutuWait from "../lottie/yutu/waiting.json";
// ! Mascot

// ! GIRAFFE
export const GIRAFFE_DONE = [
  {
    // url: '/assets/lottie/giraffe/done_1.json'),
    url: giraffeDone1,
    center: false,
    settings: {
      bottom: 0,
      right: 0,
    }
  },
  {
    url: giraffeDone2,
    center: true,
    settings: {
      // top: 0,
      bottom: 0,
    },
  }
];
export const GIRAFFE_DID = {
  url: giraffeDid,
  size: {
    width: 214,
    height: 325,
    coef: 2
  }
};
export const GIRAFFE_ERROR = {
  url: giraffeError,
  size: {
    width: 214,
    height: 325,
    coef: 2
  }
};
export const GIRAFFE_LOSE = [
  {
    url: giraffeLose1,
    size: {
      width: "100%",
      height: "100%"
    },
    settings: {
      bottom: 0,
      right: 0
    }
  }, {
    url: giraffeLose2,
    size: {
      width: "100%",
      height: "100%"
    },
    settings: {
      bottom: 0,
      right: 0
    }
  }
];
export const GIRAFFE_WAIT = {
  url: giraffeWaiting,
  size: {
    width: 214,
    height: 325,
    coef: 2
  }
};


// ! YUTU
export const YUTU_DONE = [
  {
    url: yutuDone1,
    size: {
      height: "100%",
    },
    settings: {
      top: 0,
      right: 0
    }
  },
  {
    url: yutuDone2,
    size: {
      width: "100%",
    },
    settings: {
      height: "auto",
      right: 0,
      // bottom: 0,
    }
  }
];
export const YUTU_DID = {
  url: yutuDid,
  size: {
    width: 214,
    height: 325,
    coef: 2
  }
};
export const YUTU_ERROR = {
  url: yutuError,
  size: {
    width: 214,
    height: 325,
    coef: 2
  }
};
export const YUTU_LOSE = [
  {
    url: yutuLose1,
    size: {
      width: "100%"
    },
    settings: {
      bottom: 0,
      right: 0
    }
  },
  {
    url: yutuLose2,
    size: {
      width: "100%",
      height: "100%"
    },
    settings: {
      bottom: 0,
      left: 0
    }
  }
];
export const YUTU_WAIT = {
  url: yutuWait,
  size: {
    width: 214,
    height: 325,
    coef: 2
  }
};

export const YUTU = {
  error: YUTU_ERROR,
  did: YUTU_DID,
  wait: YUTU_WAIT,
  done: YUTU_DONE,
  lose: YUTU_LOSE,
}
export const GIRAFFE = {
  error: GIRAFFE_ERROR,
  did: GIRAFFE_DID,
  wait: GIRAFFE_WAIT,
  done: GIRAFFE_DONE,
  lose: GIRAFFE_LOSE,
}


// ! Other
export const CONFETTI = {
  url: confettiData
};

export const BOOM = {
  url: '/assets/lottie/boom.json'
};

export const QUESTION = {
  url: '/assets/lottie/question.json'
};
