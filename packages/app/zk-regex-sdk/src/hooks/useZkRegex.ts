'use client';
import { useContext } from 'react'

import ZkRegexContext from "../contexts/ZkRegex";

const useZkRegex = () => {
  return { ...useContext(ZkRegexContext) }
}

export default useZkRegex