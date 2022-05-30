

import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Dimensions} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {

  const [nfcMsg, setNfcMsg] = useState('')
  const [refreshScreen,setRefreshScreen] = useState(false)
  const readNdef = async() => {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      
      const tag = await NfcManager.getTag()   
      const text = Ndef.text.decodePayload(tag.ndefMessage[0].payload)

      Alert.alert(
        'Nfc ', 
        text,
        [
          { text: "OK", onPress: () => setRefreshScreen(!refreshScreen) }
        ],
        {onDismiss : setRefreshScreen(!refreshScreen) }
        )
      // Alert.alert('NFC',tag)
    } catch (ex) {
      setRefreshScreen(!refreshScreen)
      console.warn('Oops!', ex);
    } finally {
      console.log('first')
      // stop the nfc scanning
      setRefreshScreen(!refreshScreen)
      NfcManager.cancelTechnologyRequest();
    }
  }

  
async function writeDef() {
  let result = false;

  try {
    // STEP 1
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([Ndef.textRecord(nfcMsg)]);

    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      result = true;
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    setRefreshScreen(!refreshScreen)
    NfcManager.cancelTechnologyRequest();
  }

  console.log(result);
}

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={{height : 50, backgroundColor: 'lightblue', width: '80%',borderRadius: 10, alignItems:'center', justifyContent: 'center'}} onPress={readNdef}>
        <Text>Read</Text>
      </TouchableOpacity>
      <TextInput style={{position: 'absolute', bottom: 70}} placeholder='Message' onChangeText={(newValue)=> {setNfcMsg(newValue)}} />
      <TouchableOpacity style={{height : 50, backgroundColor: 'lightblue', width: '80%',borderRadius: 10, alignItems:'center', justifyContent: 'center', position: 'absolute', bottom: 10}} onPress={writeDef}>
        <Text>Write</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height
  },
});

export default App;