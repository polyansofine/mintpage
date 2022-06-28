// import logo from "./logo.svg";
import Onboard from "@web3-onboard/core";
import "./App.css";
import { Button, Grid, Card, Fab, Typography, IconButton } from "@mui/material";
// import { toHex, truncateAddress } from "./utils";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import walletLinkModule from "@web3-onboard/walletlink";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useMemo, useState } from "react";
import { toHex } from "./utils/utils";
import { useParams } from "react-router-dom";
import { Container } from "@mui/system";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import * as defra from "./utils/defra";
import { config } from "./config";
import * as fuseActions from "./store/actions";
import { useDispatch } from "react-redux";

const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
const ROPSTEN_RPC_URL = `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
const RINKEBY_RPC_URL = `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

const injected = injectedModule();
const walletConnect = walletConnectModule();
const walletLink = walletLinkModule();

const onboard = Onboard({
  wallets: [walletLink, walletConnect, injected],
  chains: [
    {
      id: "0x1", // chain ID must be in hexadecimel
      token: "ETH", // main chain token
      namespace: "evm",
      label: "Ethereum Mainnet",
      rpcUrl: MAINNET_RPC_URL,
    },
    {
      id: "0x3",
      token: "tROP",
      namespace: "evm",
      label: "Ethereum Ropsten Testnet",
      rpcUrl: ROPSTEN_RPC_URL,
    },
    {
      id: "0x4",
      token: "rETH",
      namespace: "evm",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: RINKEBY_RPC_URL,
    },
  ],
  appMetadata: {
    name: "My App",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    description: "My app using Onboard",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

function hexToRgb(hex) {
  if (!hex) return 0;
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function App(props) {
  //  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(1);
  const [data, setData] = useState({});
  const [image, setImage] = useState();
  const [background, setBackground] = useState();
  const [token, setToken] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [balance, setBalance] = useState();
  const [max, setMax] = useState();
  const [total, setTotal] = useState();
  const dispatch = useDispatch();

  const query = new URLSearchParams(props.location.search);
  const contract = query.get("contract");

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/v2/page/getPage/${contract}`
      );
      const response = await res.json();
      if (response.page) {
        setData(response.page);
      }

      const res1 = await fetch(
        `${process.env.REACT_APP_URL}/v2/page/getPageImage/${contract}`
      );
      const response1 = await res1.blob();
      console.log("reson1", response1);
      setBackground(URL.createObjectURL(response1));
      await getContract(contract);
    };
    if (contract) {
      getData();
    }
  }, [contract]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/v2/collection/collections/get_gifImage/${data.collection_id}`
      );
      setImage(URL.createObjectURL(await res.blob()));
    }
    if (data.collection_id) {
      getData();
    }
  }, [data]);

  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      setIsLoading(true);
      const { accounts, chains, provider } = wallets[0];
      setAccount(accounts[0].address);
      setChainId(chains[0].id);
      setProvider(provider);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  };
  const getContract = async (contract) => {
    console.log("contract==", contract);
    if (!contract) {
      console.error("missing contract id");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (contract) {
      const simplifiedAbi = [
        "function abiHash() public view virtual returns (string memory)",
        "function provenanceHash() public view virtual returns (string memory)",
      ];

      // let contractRes = await fetch(
      //   config().apiHost + "/v2/contract/artifact",
      //   { headers: JSON.parse(localStorage.getItem("ethAuth_" + user.address)) }
      // );
      // await contractRes.json();

      // console.log(this.contractAddress, contract.abi);
      const metadataGetter = new ethers.Contract(
        contract,
        simplifiedAbi,
        provider.getSigner(0)
      );

      const abiHash = await metadataGetter.abiHash();

      const abiObject = await defra.getIpfsHash(abiHash);
      if (!abiObject || abiObject.error) {
        throw new Error("failed to get abiObject");
      }

      const token = new ethers.Contract(
        contract,
        abiObject,
        provider.getSigner(0)
      );
      setToken(token);

      const exists = (await token.provider.getCode(token.address)) !== "0x";

      if (!exists) {
        console.error("does not exist", token.address);
        dispatch(
          fuseActions.showMessage({
            message:
              "Contract is not deployed on the current network check with the provider",
            variant: "error",
          })
        );
      } else {
        await getNFT(token, contract);
      }
    }
  };
  const getNFT = async (token, contract) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const name = await token.name();
    setName(name);
    const price = (await token.price()) / 1e18;
    setPrice(price);
    const balance = await provider.getBalance(contract);
    console.log("balance==", balance);
    setBalance(balance / 10 ** 18);
    const ipfsRootHash = (await token.provenanceHash()).toString();
    const totalSupply = (await token.totalSupply()).toString();
    setTotal(totalSupply);
    const airdropAvailable = (await token._airdrop_available()).toString();
    const maxSupply = (await token.max_supply()).toString();
    setMax(maxSupply);
    const mintStart = (await token._mint_start()).toString();
    const presale_status = await token._available_presale();
    const public_status = await token._available_public_mint();
    // setPresale(presale_status);
    // setPublicMint(public_status);
    // let openseaURL = "";

    // if (window.ethereum.networkVersion !== "31337") {
    //   try {
    //     const res = await fetch(
    //       config().openseaApi + "/api/v1/asset_contract/" + contract.address
    //     );
    //     const response = await res.json();
    //     console.log("rescollection==", response);
    //     openseaURL = config().openseaHost + "/collection/" + response.name;
    //     setOpensea(openseaURL);
    //   } catch (e) {}
    // }
    // const location = window.location.href.split("/");
    // // console.log("contractpagelocation==", location[0] + "//" + location[2]);
    // const locationUrl = location[0] + "//" + location[2];
    // setForm({
    //   ...form,
    //   contractId: contract.id,
    //   name,
    //   price,
    //   description: collection.description,
    //   mint_start: mintStart,
    //   max_supply: maxSupply,
    //   provenance: ipfsRootHash,
    //   airdropAvailable,
    //   openseaURL,
    //   purchaseURL: presale_status
    //     ? locationUrl + "/presale_user/" + contract.address
    //     : locationUrl + "/public_mint/" + contract.address,
    //   airdropRedeemURL:
    //     config().storeFrontHost +
    //     "?contract=" +
    //     contract.address +
    //     "&redeem=true",
    //   contractAddress: contract.address,
    //   totalSupply,
    //   balance: parseInt(balance._hex),
    // });
    // setLoading(false);
  };
  const handleMint = async () => {
    try {
      if (token) {
        await token.purchase(value, {
          value: ethers.utils.parseEther(`${price * value}`),
        });
        await getNFT(token, contract);
        dispatch(
          fuseActions.showMessage({
            message: "Success mint",
            variant: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        fuseActions.showMessage({
          message: error.message ? error.message : error.data.message,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        })
      );
      console.log("error=", error);
    }
  };

  const switchNetwork = async () => {
    await onboard.setChain({ chainId: toHex(network) });
  };

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const disconnects = async () => {
    console.log("hello");
    const [primaryWallet] = await onboard.state.get().wallets;
    // if (!primaryWallet) return;
    await onboard.disconnectWallet({ label: primaryWallet.label });
    console.log("hello primary");

    refreshState();
  };

  const refreshState = () => {
    setAccount("");
    setChainId("");
    setProvider();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: data?.color,
        padding: 10,
        backgroundImage: `url(${background})` || null,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundSize: "cover",
      }}
    >
      <Container>
        <Grid container direction="row">
          {!account ? (
            <Button
              variant={data.btn_variant || "contained"}
              color={data.btn_color || "primary"}
              onClick={connectWallet}
              style={{ fontFamily: data?.font, textTransform: data?.transform }}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              variant={data.btn_variant || "contained"}
              color={data.btn_color || "primary"}
              onClick={disconnects}
              style={{ fontFamily: data?.font, textTransform: data?.transform }}
            >
              Disconnect
            </Button>
          )}
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ my: 2 }}
        >
          <Card
            sx={{
              p: 4,
              backgroundColor: `rgba(${hexToRgb(data?.card_color).r}, ${
                hexToRgb(data?.card_color).g
              }, ${hexToRgb(data?.card_color).b},${data?.opacity_value / 100})`,
              backdropFilter: `blur(${data?.blur_value}px)`,
            }}
          >
            <Grid container justifyContent="center">
              {image ? (
                <img width="300px" height="350px" alt="new" src={image} />
              ) : (
                <Skeleton width="300px" height="350px" />
              )}
            </Grid>
            <Grid container justifyContent="center">
              <Typography
                style={{
                  fontFamily: data?.font,
                  textTransform: data?.transform,
                }}
              >
                {total}/{max}
              </Typography>
            </Grid>
            <Grid container justifyContent="center">
              <Typography
                style={{
                  fontFamily: data?.font,
                  textTransform: data?.transform,
                }}
              >
                {name}
              </Typography>
            </Grid>
            {/* <Grid container justifyContent="center">
              <Typography
                style={{
                  fontFamily: data?.font,
                  textTransform: data?.transform,
                }}
              >
                {balance}
              </Typography>
            </Grid> */}
            <Grid container justifyContent="center">
              <Typography
                style={{
                  fontFamily: data?.font,
                  textTransform: data?.transform,
                }}
              >
                {price * value}eth
              </Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={4}
              sx={{ mb: 2 }}
            >
              <Grid item>
                <IconButton onClick={() => setValue(value + 1)}>
                  <AddIcon
                    style={{
                      fontFamily: data?.font,
                      textTransform: data?.transform,
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography
                  style={{
                    fontFamily: data?.font,
                    textTransform: data?.transform,
                  }}
                >
                  {value}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => setValue(value - 1)}>
                  <RemoveIcon
                    style={{
                      fontFamily: data?.font,
                      textTransform: data?.transform,
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center">
              <Button
                variant={data.btn_variant || "contained"}
                color={data.btn_color || "primary"}
                style={{
                  fontFamily: data?.font,
                  textTransform: data?.transform,
                }}
                onClick={handleMint}
              >
                Mint
              </Button>
            </Grid>
          </Card>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
